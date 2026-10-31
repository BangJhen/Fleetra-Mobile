import React, { useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Compass, Maximize2, Minimize2, Navigation } from 'lucide-react-native';
import { colors } from '../theme/colors';

interface MapWebViewProps {
  height?: number;
  originName?: string;
  destinationName?: string;
  distance?: string;
  duration?: string;
}

const generateMapHtml = (destinationName: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <title>FLEETRA Dynamic Route</title>
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    * { box-sizing: border-box; }
    html, body, #map {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      background: #F8FAFC;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }
    .leaflet-control-attribution {
      font-size: 8px !important;
      background: rgba(255,255,255,0.7) !important;
      padding: 1px 4px !important;
    }
    /* Van pulse marker */
    .vehicle-marker {
      position: relative;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .vehicle-pulse {
      position: absolute;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: rgba(36, 99, 216, 0.25);
      animation: pulse 1.8s infinite ease-out;
    }
    .vehicle-core {
      position: relative;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: #2463D8;
      border: 2.5px solid #FFFFFF;
      box-shadow: 0 2px 6px rgba(0,0,0,0.25);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #FFFFFF;
      font-size: 11px;
      font-weight: bold;
    }
    /* Destination pin */
    .dest-pin {
      position: relative;
      width: 30px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .dest-pin-svg {
      filter: drop-shadow(0 3px 6px rgba(0,0,0,0.3));
    }
    @keyframes pulse {
      0% { transform: scale(0.6); opacity: 0.9; }
      100% { transform: scale(1.4); opacity: 0; }
    }
    .custom-popup .leaflet-popup-content-wrapper {
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.12);
      padding: 2px 4px;
    }
    .popup-title {
      font-size: 11.5px;
      font-weight: 700;
      color: #0F172A;
      margin-bottom: 2px;
    }
    .popup-desc {
      font-size: 10px;
      color: #64748B;
    }
  </style>
</head>
<body>
  <div id="map"></div>

  <script>
    // 1. Initialize Map
    var map = L.map('map', {
      zoomControl: false,
      attributionControl: true
    }).setView([-6.9100, 107.6000], 14);

    // 2. Clean Light CartoDB Positron Layer (Free & Open-Source)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd',
      attribution: '&copy; OpenStreetMap &copy; CARTO'
    }).addTo(map);

    // 3. Route Waypoints (Bandung Route Corridor: Pasteur -> Jl. Sudirman No. 45)
    var routeCoords = [
      [-6.8992, 107.5954], // Posisi Armada (Jl. Pasteur)
      [-6.9015, 107.5968],
      [-6.9042, 107.5982], // Pasirkaliki
      [-6.9085, 107.6001],
      [-6.9130, 107.6020], // Gardujati
      [-6.9175, 107.6035],
      [-6.9214, 107.6046]  // Toko Sumber Rejeki (Jl. Sudirman 45)
    ];

    // 4. Draw Route Line (FLEETRA Blue with subtle glow)
    var routeHalo = L.polyline(routeCoords, {
      color: '#93C5FD',
      weight: 8,
      opacity: 0.5,
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(map);

    var routeLine = L.polyline(routeCoords, {
      color: '#2463D8',
      weight: 4.5,
      opacity: 0.95,
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(map);

    // 5. Vehicle Custom Marker (Armada B 9821 KCE)
    var vehicleHtml = '<div class="vehicle-marker"><div class="vehicle-pulse"></div><div class="vehicle-core">▲</div></div>';
    var vehicleIcon = L.divIcon({
      className: '',
      html: vehicleHtml,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });
    var vehicleMarker = L.marker([-6.8992, 107.5954], { icon: vehicleIcon }).addTo(map);
    vehicleMarker.bindPopup('<div class="popup-title">Armada B 9821 KCE</div><div class="popup-desc">Gran Max Blind Van • Kecepatan: 38 km/jam</div>');

    // 6. Destination Marker (Toko Sumber Rejeki)
    var destSvg = '<svg class="dest-pin-svg" width="28" height="34" viewBox="0 0 28 34" fill="none"><path d="M14 0C6.268 0 0 6.268 0 14c0 10.5 14 20 14 20s14-9.5 14-20C28 6.268 21.732 0 14 0z" fill="#EF4444"/><circle cx="14" cy="14" r="5.5" fill="#FFFFFF"/></svg>';
    var destIcon = L.divIcon({
      className: 'dest-pin',
      html: destSvg,
      iconSize: [28, 34],
      iconAnchor: [14, 34],
      popupAnchor: [0, -32]
    });
    var destMarker = L.marker([-6.9214, 107.6046], { icon: destIcon }).addTo(map);
    destMarker.bindPopup('<div class="popup-title">${destinationName}</div><div class="popup-desc">Stop 2 • Jl. Sudirman No. 45<br>Estimasi tiba: 12 menit</div>');

    // 7. Auto fit bounds with gentle padding
    map.fitBounds(routeLine.getBounds(), { padding: [30, 30] });

    // Function for recentering
    window.recenterRoute = function() {
      map.fitBounds(routeLine.getBounds(), { padding: [30, 30] });
    };
  </script>
</body>
</html>
`;

export const MapWebView: React.FC<MapWebViewProps> = ({
  height = 200,
  originName = 'Posisi Armada (Pasteur)',
  destinationName = 'Toko Sumber Rejeki',
  distance = '+ 4,2 km',
  duration = '± 12 menit',
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const htmlContent = generateMapHtml(destinationName);

  return (
    <View style={[styles.container, { height: isFullscreen ? 320 : height }]}>
      {/* MAP VIEWPORT */}
      <View style={styles.mapWrapper}>
        {Platform.OS === 'web' ? (
          // Web fallback: clean native iframe with OpenStreetMap Leaflet
          // @ts-ignore
          <iframe
            srcDoc={htmlContent}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              borderRadius: 14,
            }}
            title="FLEETRA OpenStreetMap"
            onLoad={() => setIsLoading(false)}
          />
        ) : (
          // Native iOS & Android WebView
          <WebView
            originWhitelist={['*']}
            source={{ html: htmlContent }}
            style={styles.webView}
            scrollEnabled={true}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            onLoadEnd={() => setIsLoading(false)}
          />
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={styles.loadingText}>Memuat Peta OSRM...</Text>
          </View>
        )}

        {/* Route Badge Overlay (Top Left) */}
        <View style={styles.routeBadge}>
          <Navigation size={12} color={colors.primary} strokeWidth={2.5} />
          <Text style={styles.routeBadgeText}>
            {distance} • {duration}
          </Text>
        </View>

        {/* Map Controls (Top Right) */}
        <View style={styles.controlsCol}>
          <TouchableOpacity
            style={styles.controlBtn}
            onPress={() => setIsFullscreen((prev) => !prev)}
            activeOpacity={0.8}
          >
            {isFullscreen ? (
              <Minimize2 size={14} color={colors.textSecondary} strokeWidth={2.2} />
            ) : (
              <Maximize2 size={14} color={colors.textSecondary} strokeWidth={2.2} />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 18,
    marginTop: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface2,
    overflow: 'hidden',
  },
  mapWrapper: {
    flex: 1,
    position: 'relative',
  },
  webView: {
    flex: 1,
    backgroundColor: colors.surface2,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(248, 250, 252, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    zIndex: 10,
  },
  loadingText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  routeBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
    zIndex: 5,
  },
  routeBadgeText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: colors.text,
  },
  controlsCol: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 5,
  },
  controlBtn: {
    width: 28,
    height: 28,
    borderRadius: 7,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
});
