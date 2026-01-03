import { Component, OnInit } from '@angular/core';
import { Api } from '../shared/services/api';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {

  catList:any = [
    {
      title: 'FICTION',
      icon: 'fiction-icon'
    },
    {
      title: 'DRAMA',
      icon: 'drama-icon'
    },
    {
      title: 'HUMOUR',
      icon: 'humour-icon'
    },
    {
      title: 'POLITICS',
      icon: 'politics-icon'
    },
    {
      title: 'PHILOSOPHY',
      icon: 'philosophy-icon'
    },
    {
      title: 'HISTORY',
      icon: 'history-icon'
    },
    {
      title: 'ADVENTURE',
      icon: 'adventure-icon'
    }
  ];

  constructor(private api:Api) {

  }

  ngOnInit(): void {
    this.getCategoryList();
  }

  getCategoryList() {
    // this.api.getCategories().subscribe((data:any)=>{
    //   //this.catList = data;
    // });
  }

}
