import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  template: `<h1>Hello {{name}}</h1>
        <p> Testing angular 2 </p>`,
})
export class AppComponent  { name = 'Ashok'; }
