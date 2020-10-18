import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';

import {Observable} from 'rxjs';

import {Character} from '@app/shared/interfaces/character.interface';
import {CharacterService} from '@app/shared/services/character.service';
import {TrackHttpError} from '@shared/models/trackHttpError';

import {take} from 'rxjs/operators';

@Component({
  selector: 'app-character-details',
  templateUrl: './character-details.component.html',
  styleUrls: ['./character-details.component.scss']
})
export class CharacterDetailsComponent implements OnInit {
  character$: Observable<Character | TrackHttpError>;

  constructor(private activeRoute: ActivatedRoute,
              private characterService: CharacterService,
              private location: Location) { }

  ngOnInit(): void {
    this.activeRoute.params.pipe( take(1)).subscribe( (params) => {
      const id = params.id;
      this.character$ = this.characterService.getDetails(id);
    });
  }

  onBack(): void{
    this.location.back();
    // window.history.back();
  }
}
