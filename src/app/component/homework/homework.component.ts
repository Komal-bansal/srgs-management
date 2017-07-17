import {Component} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector:'homework',
  templateUrl:'./homework.component.html',
  styleUrls:['./homework.component.css']
})
export class HomeworkComponent{
    constructor(private router:Router){
         this.router.navigate(["/homework/current-homework"]);
    }
    
  }
