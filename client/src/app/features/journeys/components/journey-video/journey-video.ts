import { Component, computed, input, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-journey-video',
  standalone: true,
  template: `
    @if (embedUrl()) {
      <div class="aspect-video w-full max-w-xl mx-auto overflow-hidden rounded-xl bg-base-300">
        <iframe
          class="h-full w-full"
          [src]="embedUrl()"
          title="Journey introduction video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen
        ></iframe>
      </div>
    }
  `,
})
export class JourneyVideoComponent {
  videoUrl = input<string | null | undefined>(null);

  private sanitizer = inject(DomSanitizer);

  embedUrl = computed<SafeResourceUrl | null>(() => {
    const url = this.videoUrl();
    if (!url) return null;

    try {
      const parsed = new URL(url);
      let videoId: string | null = null;

      if (parsed.hostname === 'youtu.be') {
        videoId = parsed.pathname.slice(1);
      } else if (['youtube.com', 'www.youtube.com', 'm.youtube.com'].includes(parsed.hostname)) {
        if (parsed.pathname === '/watch') {
          videoId = parsed.searchParams.get('v');
        } else if (
          parsed.pathname.startsWith('/embed/') ||
          parsed.pathname.startsWith('/shorts/')
        ) {
          videoId = parsed.pathname.split('/')[2] ?? null;
        }
      }

      if (!videoId || !/^[a-zA-Z0-9_-]{11}$/.test(videoId)) return null;

      return this.sanitizer.bypassSecurityTrustResourceUrl(
        `https://www.youtube-nocookie.com/embed/${videoId}`,
      );
    } catch {
      return null;
    }
  });
}
