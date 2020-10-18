import {Component, HostListener, Inject, OnInit} from '@angular/core';
import {filter, take} from 'rxjs/operators';
import {ActivatedRoute, NavigationEnd, ParamMap, Router} from '@angular/router';
import {DOCUMENT} from '@angular/common';

import {Character} from '@shared/interfaces/character.interface';
import {CharacterService} from '@shared/services/character.service';
import {TrackHttpError} from '@shared/models/trackHttpError';

type RequestInfo = {
  next: string;
};


@Component({
  selector: 'app-character-list',
  templateUrl: './character-list.component.html',
  styleUrls: ['./character-list.component.scss']
})
export class CharacterListComponent implements OnInit {

  characters: Character[] = [];
  info: RequestInfo = {
    next: null,
  };
  private pageNum = 1;
  private query: string;
  private hideScrollHeight = 200;
  private showScrollHeight = 500;
  showGoUpButton = false;


  constructor(private characterService: CharacterService,
              private activateRoute: ActivatedRoute,
              private router: Router,
              @Inject(DOCUMENT) private document: Document) {
    this.onUrlChange();
  }

  ngOnInit(): void {
    // this.gertDataFromServices();
    this.getCharactersByQuery();
  }

  @HostListener('window:scroll', [])

  onWindowScroll(): void {
    const yOffSet = window.pageYOffset;
    if ((yOffSet || this.document.documentElement.scrollTop || this.document.body.scrollTop) > this.showScrollHeight) {
      this.showGoUpButton = true;
    } else if (this.showGoUpButton && (yOffSet || this.document.documentElement.scrollTop || this.document.body.scrollTop) < this.hideScrollHeight) {
      this.showGoUpButton = false;
    }
  }

  onScrollDown(): void {
    if (this.info.next) {
      this.pageNum++;
      this.gertDataFromServices();
    }
  }

  onScrollTop(): void {
    this.document.body.scrollTop = 0; // Safari
    this.document.documentElement.scrollTop = 0;  // All browser
  }

  private onUrlChange(): void {
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd)
    ).subscribe(
      () => {
        this.characters = [];
        this.pageNum = 1;
        this.getCharactersByQuery();
      });
  }

  private getCharactersByQuery(): void {
    this.activateRoute.queryParams.pipe(
      take(1)
    ).subscribe( (params: ParamMap) => {
      // console.log('params->', params);
      this.query = params['q'];
      this.gertDataFromServices();
    });
  }

  private gertDataFromServices(): void {
    this.characterService.searchCharacerts(this.query, this.pageNum).pipe(
      take(1)
    ).subscribe( (res: any) => {
      if (res?.results?.length) {
        const {info, results} = res;
        this.characters = [...this.characters, ...results];
        this.info = info;
      } else {
        this.characters = [];
      }

    }, ( error: TrackHttpError) => console.log((error.friendlyMessage))
    );
  }

}
