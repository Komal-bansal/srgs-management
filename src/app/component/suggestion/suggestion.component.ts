import {Component} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
@Component({
  selector:'suggestion',
  templateUrl:'./suggestion.component.html',
  styleUrls:['./suggestion.component.css']
})
export class SuggestionComponent{
  public suggestionStatus:any;
  constructor(private route: ActivatedRoute,private router:Router){
    this.route.params.subscribe(param => {
      // console.log("asddf df",this.suggestionStatus);
    });
    this.router.navigate(["/suggestion/for-me"]);
  }
}