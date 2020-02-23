import { Component, OnInit, ViewChild } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute } from "@angular/router";
import { YouTubePlayer } from "@angular/youtube-player";
import { API_KEY } from 'api_key';
import { LoadingService } from '../loading/loading.service';

@Component({
  selector: "app-playlist",
  templateUrl: "./playlist.component.html",
  styleUrls: ["./playlist.component.scss"]
})
export class PlaylistComponent implements OnInit {
  items: any[] = [];
  playlistId: string;

  activeVideoId: string;
  activeVideoIndex: number;

  isPaused = true;

  context = new AudioContext();
  analyser = this.context.createAnalyser();
  source: MediaElementAudioSourceNode;

  @ViewChild("player", { static: null }) player: YouTubePlayer;

  constructor(private http: HttpClient, private route: ActivatedRoute, private loading: LoadingService) {}

  ngOnInit() {
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(tag);
    this.playlistId = this.route.snapshot.paramMap.get("id");
    this.makeRequest(null);
  }

  makeRequest(pageToken: string) {
    if (!this.playlistId) {
      return;
    }
    const params = {
      part: "id,snippet,contentDetails",
      playlistId: this.playlistId,
      key: API_KEY,
      maxResults: "50"
    };

    if (pageToken) {
      params["pageToken"] = pageToken;
    }

    this.http
      .get("https://www.googleapis.com/youtube/v3/playlistItems", { params })
      .subscribe((res: any) => {
        this.items = [...this.items, ...res.items];
        if (res.nextPageToken) {
          this.makeRequest(res.nextPageToken);
        } else {
          this.activeVideoIndex = 0;
          this.changeToActiveVideo();
          this.loading.showLoading = false;
        }
      });
  }

  changeToActiveVideo() {
    this.activeVideoId = this.items[
      this.activeVideoIndex
    ].snippet.resourceId.videoId;
  }

  stateChanges(event: { data: number }) {
    if (event.data === 5 && this.activeVideoIndex !== 0) {
      this.player.playVideo();
    }
    if (event.data === 0) {
      this.activeVideoIndex++;
      this.changeToActiveVideo();
    }
    this.isPaused = event.data !== 1;
  }

  shuffle() {
    var currentIndex = this.items.length,
      temporaryValue,
      randomIndex;

    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = this.items[currentIndex];
      this.items[currentIndex] = this.items[randomIndex];
      this.items[randomIndex] = temporaryValue;
    }

    this.activeVideoIndex = 0;
    this.changeToActiveVideo();
  }

  next() {
    this.activeVideoIndex++;
    this.changeToActiveVideo()
  }

  prev() {
    this.activeVideoIndex--;
    this.changeToActiveVideo()
  }


  get vidWidth() {
    return (window.innerWidth / 2);
  }

  get vidHeight() {
    return (window.innerHeight / 1.5);
  }

  playAndPause() {
    this.isPaused ? this.player.playVideo() : this.player.pauseVideo();
  }

  selectVideo(index: number) {
    this.activeVideoIndex = index;
    this.changeToActiveVideo();
  }

  removeLoading() {
    this.loading.showLoading = false;
  }
}
