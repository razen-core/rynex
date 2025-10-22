# Media Elements

Media elements allow you to embed and display multimedia content like videos, audio, images, and graphics. Create rich, interactive experiences with audio, video, SVG graphics, and embedded content.

## Functions

### video

Embed a video player with controls.

**Usage - Simple Video**:
```typescript
import { video, source } from 'rynex';

video(
  { controls: true, width: 640, height: 360 },
  source({ src: '/video.mp4', type: 'video/mp4' })
)
```

**Usage - Multiple Formats**:
```typescript
import { video, source } from 'rynex';

video(
  { controls: true },
  source({ src: '/video.mp4', type: 'video/mp4' }),
  source({ src: '/video.webm', type: 'video/webm' })
)
```

**Properties**:
- `src`: Video URL
- `controls`: Show player controls
- `autoplay`: Auto-play when loaded
- `loop`: Loop the video
- `muted`: Mute audio
- `poster`: Thumbnail image
- `width`: Video width
- `height`: Video height

### audio

Embed an audio player with controls.

**Usage**:
```typescript
import { audio, source } from 'rynex';

audio(
  { controls: true },
  source({ src: '/audio.mp3', type: 'audio/mpeg' })
)
```

**Usage - Playlist**:
```typescript
import { audio, source } from 'rynex';

audio(
  { controls: true },
  source({ src: '/song1.mp3', type: 'audio/mpeg' }),
  source({ src: '/song1.ogg', type: 'audio/ogg' })
)
```

**Properties**:
- `src`: Audio URL
- `controls`: Show player controls
- `autoplay`: Auto-play when loaded
- `loop`: Loop the audio
- `muted`: Mute audio
- `preload`: Preload strategy (none, metadata, auto)

### canvas

Create a drawable canvas for graphics and animations.

**Usage**:
```typescript
import { canvas } from 'rynex';

const canvasEl = canvas({
  width: 800,
  height: 600,
  style: { border: '1px solid black' }
});

// Draw on canvas using JavaScript
const ctx = canvasEl.getContext('2d');
ctx.fillStyle = 'blue';
ctx.fillRect(10, 10, 100, 100);
```

**Properties**:
- `width`: Canvas width in pixels
- `height`: Canvas height in pixels
- `class`: CSS class names

**Drawing Methods**:
- `getContext('2d')`: 2D drawing context
- `getContext('webgl')`: WebGL context

### svg

Create an SVG graphics container.

**Usage - Simple SVG**:
```typescript
import { svg } from 'rynex';

svg(
  { viewBox: '0 0 100 100', width: 200, height: 200 },
  '<circle cx="50" cy="50" r="40" fill="blue" />'
)
```

**Usage - With SVG Path**:
```typescript
import { svg, svgPath } from 'rynex';

svg(
  { viewBox: '0 0 100 100' },
  svgPath('M10 10 L90 90', { stroke: 'black', strokeWidth: 2 })
)
```

**Properties**:
- `viewBox`: SVG coordinate system
- `width`: SVG width
- `height`: SVG height
- `class`: CSS class names

### svgPath

Create an SVG path element.

**Usage**:
```typescript
import { svgPath } from 'rynex';

svgPath('M10 10 L90 90 L10 90 Z', {
  fill: 'none',
  stroke: 'black',
  strokeWidth: 2
})
```

**Path Commands**:
- `M`: Move to
- `L`: Line to
- `C`: Cubic curve
- `Q`: Quadratic curve
- `A`: Arc
- `Z`: Close path

**Properties**:
- `d`: Path data (required)
- `fill`: Fill color
- `stroke`: Stroke color
- `strokeWidth`: Stroke width

### iframe

Embed external content or another webpage.

**Usage - Embed Website**:
```typescript
import { iframe } from 'rynex';

iframe({
  src: 'https://example.com',
  width: 800,
  height: 600,
  title: 'Embedded content'
})
```

**Usage - Embed Map**:
```typescript
import { iframe } from 'rynex';

iframe({
  src: 'https://maps.google.com/...',
  width: 600,
  height: 450
})
```

**Properties**:
- `src`: URL to embed (required)
- `title`: Accessibility title
- `width`: Iframe width
- `height`: Iframe height
- `sandbox`: Security restrictions
- `allowFullscreen`: Allow fullscreen mode

### picture

Create responsive images with multiple sources.

**Usage**:
```typescript
import { picture, source, image } from 'rynex';

picture(
  {},
  source({ srcset: '/image-large.jpg', media: '(min-width: 1024px)' }),
  source({ srcset: '/image-medium.jpg', media: '(min-width: 768px)' }),
  image({ src: '/image-small.jpg', alt: 'Responsive image' })
)
```

**When to Use**:
- Different images for different screen sizes
- Different image formats (WebP, JPEG)
- Art direction based on viewport

### source

Specify media source for video, audio, or picture elements.

**Usage - Video Source**:
```typescript
import { source } from 'rynex';

source({
  src: '/video.mp4',
  type: 'video/mp4'
})
```

**Usage - Audio Source**:
```typescript
import { source } from 'rynex';

source({
  src: '/audio.mp3',
  type: 'audio/mpeg'
})
```

**Properties**:
- `src`: Media URL (required)
- `type`: Media MIME type
- `srcset`: Responsive image sources
- `media`: Media query for picture element

### track

Add captions, subtitles, or descriptions to video.

**Usage - Subtitles**:
```typescript
import { video, source, track } from 'rynex';

video(
  { controls: true },
  source({ src: '/video.mp4', type: 'video/mp4' }),
  track({
    src: '/subtitles-en.vtt',
    kind: 'subtitles',
    srclang: 'en',
    label: 'English'
  })
)
```

**Usage - Captions**:
```typescript
import { track } from 'rynex';

track({
  src: '/captions.vtt',
  kind: 'captions',
  srclang: 'en'
})
```

**Properties**:
- `src`: Track file URL (required)
- `kind`: Track type (subtitles, captions, descriptions, chapters, metadata)
- `srclang`: Language code
- `label`: Track label

**Track Kinds**:
- `subtitles`: Translations of dialogue
- `captions`: Translations and sound descriptions
- `descriptions`: Audio descriptions
- `chapters`: Chapter titles
- `metadata`: Metadata for scripting

## Common Patterns

### Video with Captions

```typescript
import { video, source, track } from 'rynex';

video(
  { controls: true, width: 640, height: 360 },
  source({ src: '/video.mp4', type: 'video/mp4' }),
  track({
    src: '/captions.vtt',
    kind: 'captions',
    srclang: 'en',
    label: 'English'
  })
)
```

### Audio Playlist

```typescript
import { audio, source } from 'rynex';

audio(
  { controls: true },
  source({ src: '/song1.mp3', type: 'audio/mpeg' }),
  source({ src: '/song1.ogg', type: 'audio/ogg' })
)
```

### Responsive Image

```typescript
import { picture, source, image } from 'rynex';

picture(
  {},
  source({ srcset: '/image.webp', type: 'image/webp' }),
  source({ srcset: '/image.jpg', type: 'image/jpeg' }),
  image({ src: '/image.jpg', alt: 'Description' })
)
```

### SVG Icon

```typescript
import { svg } from 'rynex';

svg(
  { viewBox: '0 0 24 24', width: 24, height: 24 },
  '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />'
)
```

### Canvas Drawing

```typescript
import { canvas } from 'rynex';

const canvasEl = canvas({ width: 400, height: 300 });
const ctx = canvasEl.getContext('2d');

ctx.fillStyle = 'red';
ctx.fillRect(50, 50, 100, 100);

ctx.fillStyle = 'blue';
ctx.beginPath();
ctx.arc(250, 150, 50, 0, Math.PI * 2);
ctx.fill();
```

### Embedded Map

```typescript
import { iframe } from 'rynex';

iframe({
  src: 'https://www.google.com/maps/embed?pb=...',
  width: 600,
  height: 450,
  style: { border: 0 },
  allowFullscreen: true,
  loading: 'lazy'
})
```

## Media Format Support

**Video Formats**:
- MP4 (H.264): `video/mp4`
- WebM (VP8/VP9): `video/webm`
- Ogg (Theora): `video/ogg`

**Audio Formats**:
- MP3: `audio/mpeg`
- WAV: `audio/wav`
- Ogg: `audio/ogg`
- WebM: `audio/webm`

**Image Formats**:
- JPEG: `image/jpeg`
- PNG: `image/png`
- WebP: `image/webp`
- SVG: `image/svg+xml`

## Accessibility Tips

- Always provide `alt` text for images
- Add captions and subtitles for videos
- Use `title` attribute for iframes
- Provide multiple media formats
- Use semantic HTML for media
- Test with screen readers
- Ensure keyboard navigation works

## Performance Tips

- Use responsive images with `picture`
- Compress media files
- Use appropriate formats
- Lazy load iframes with `loading="lazy"`
- Preload critical media
- Use CDN for media delivery
- Consider video thumbnails

## Tips

- Always provide fallback content
- Use multiple formats for browser compatibility
- Add captions for accessibility
- Optimize media file sizes
- Use responsive images
- Test on different devices
- Provide controls for user interaction

## Next Steps

- Learn about [Basic Elements](./basic-elements.md) for content
- Explore [Semantic Elements](./semantic.md) for structure
- Check [Best Practices](../best-practices.md) for media tips

## Related

- [Basic Elements](./basic-elements.md)
- [Semantic Elements](./semantic.md)
- [Components](./components.md)
