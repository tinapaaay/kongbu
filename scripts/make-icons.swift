// Draws Kongbu's app icons (공 on textbook blue) as PNGs, with the Korean system font.
// macOS only, run once by hand: swift scripts/make-icons.swift   (writes to public/)
// Colors are DESIGN.md tokens: primary #3F71A8, surface #FEFEFE.
import AppKit

func icon(size: Int, rounded: Bool, glyphScale: CGFloat, file: String) {
  let rep = NSBitmapImageRep(bitmapDataPlanes: nil, pixelsWide: size, pixelsHigh: size, bitsPerSample: 8,
                             samplesPerPixel: 4, hasAlpha: true, isPlanar: false, colorSpaceName: .deviceRGB,
                             bytesPerRow: 0, bitsPerPixel: 0)!
  NSGraphicsContext.saveGraphicsState()
  NSGraphicsContext.current = NSGraphicsContext(bitmapImageRep: rep)
  let s = CGFloat(size)
  let rect = NSRect(x: 0, y: 0, width: s, height: s)
  NSColor(srgbRed: 0x3F / 255, green: 0x71 / 255, blue: 0xA8 / 255, alpha: 1).setFill()
  // Same corner as the favicon (6 of 32). Maskable and Apple icons are full squares: the system cuts the shape.
  (rounded ? NSBezierPath(roundedRect: rect, xRadius: s * 6 / 32, yRadius: s * 6 / 32) : NSBezierPath(rect: rect)).fill()
  let font = NSFont(name: "AppleSDGothicNeo-Bold", size: s * glyphScale)!
  let text = NSAttributedString(string: "공", attributes: [
    .font: font, .foregroundColor: NSColor(srgbRed: 0xFE / 255, green: 0xFE / 255, blue: 0xFE / 255, alpha: 1),
  ])
  // Center the glyph's drawn shape (its path bounds), not its line box, so it sits optically in the middle.
  let line = CTLineCreateWithAttributedString(text)
  let bounds = CTLineGetBoundsWithOptions(line, .useGlyphPathBounds)
  let context = NSGraphicsContext.current!.cgContext
  context.textPosition = CGPoint(x: (s - bounds.width) / 2 - bounds.minX, y: (s - bounds.height) / 2 - bounds.minY)
  CTLineDraw(line, context)
  NSGraphicsContext.restoreGraphicsState()
  try! rep.representation(using: .png, properties: [:])!.write(to: URL(fileURLWithPath: "public/\(file)"))
}

icon(size: 192, rounded: true, glyphScale: 0.6, file: "pwa-192x192.png")
icon(size: 512, rounded: true, glyphScale: 0.6, file: "pwa-512x512.png")
// Maskable: the system may crop to a circle, so keep the glyph inside the middle 80%.
icon(size: 512, rounded: false, glyphScale: 0.45, file: "maskable-512x512.png")
icon(size: 180, rounded: false, glyphScale: 0.55, file: "apple-touch-icon.png")
