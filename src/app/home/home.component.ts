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

  form = new FormControl('');
  nextPageToken: string = null;
  prevPageToken: string = null;
  pageToken: string = null;

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
      order: 'title',
      maxResults: 30
    };

    if(this.pageToken) {
      params['pageToken'] = this.pageToken;
    }

    if (this.input.length === 34 && this.input.split(' ').length === 1) {
      this.getPlaylist().subscribe((res: any) => this.router.navigate(['playlist', res.items[0].id]));
    } else {
      this.http.get('https://www.googleapis.com/youtube/v3/search', {params}).subscribe((res: any) => {
        this.playlistsFound = res.items
        this.nextPageToken = res.nextPageToken;
        this.prevPageToken = res.prevPageToken;
        document.getElementById('searchbar').scrollIntoView({behavior: 'smooth'});
      });
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
    console.log('xamei');
    console.log(id);
    this.router.navigate(['playlist', id])
  }


  changePage(token: string) {
    this.pageToken = token;
    this.search();
  }
}
