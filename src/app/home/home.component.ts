import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { API_KEY } from 'api_key';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  form = new FormControl('PLq2mrFlQJXkBz39YS0TjE_gU7i111FP3B');

  res: any = {};
  
  requestFinished = true;

  playlistsFound = [];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
  }

  search() {
    const params: any = {
      part: 'snippet',
      q: this.input,
      type: 'playlist',
      key: API_KEY,
      order: 'title'
    };

    if (this.input.length === 34 && this.input.split(' ').length === 1) {
      this.getPlaylist().subscribe((res: any) => this.playlistsFound = res.items);
    } else {
      this.http.get('https://www.googleapis.com/youtube/v3/search', {params}).subscribe((res: any) => this.playlistsFound = res.items);
    }
  }

  get input() {
    return this.form.value;
  }

  getPlaylist() {
    return this.http.get('https://www.googleapis.com/youtube/v3/playlists', {params: {
      part: 'snippet',
      id: this.input,
      key: API_KEY
    }});
  }

  openPlaylist(id: string) {
    this.router.navigate(['playlist', id])
  }

}
