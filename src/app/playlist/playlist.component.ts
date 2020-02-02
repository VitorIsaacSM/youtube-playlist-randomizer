import { Component, OnInit, ViewChild } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute } from "@angular/router";
import { YouTubePlayer } from "@angular/youtube-player";
import { API_KEY } from 'api_key';

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

  @ViewChild("player", { static: null }) player: YouTubePlayer;

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit() {
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(tag);
    this.playlistId = this.route.snapshot.paramMap.get("id");
    this.makeRequest(null);
  }

  log(a: any) {
    console.log(a);
  }

  makeRequest(pageToken: string) {
    if (!this.playlistId) {
      console.error("id zuado");
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
        console.log(res);
        this.items = [...this.items, ...res.items];
        console.log(this.items);
        if (res.nextPageToken) {
          this.makeRequest(res.nextPageToken);
        } else {
          this.activeVideoIndex = 0;
          this.changeToActiveVideo();
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
  }

  shuffle() {
    var currentIndex = this.items.length,
      temporaryValue,
      randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = this.items[currentIndex];
      this.items[currentIndex] = this.items[randomIndex];
      this.items[randomIndex] = temporaryValue;
    }

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
}
