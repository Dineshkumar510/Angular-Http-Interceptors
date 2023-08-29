import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { map, catchError } from 'rxjs/operators';
import { Observable, Subject, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PostService {

  error = new Subject<string>();
  private urlLink: string = 'https://angular-project-26d33-default-rtdb.firebaseio.com/posts.json';

constructor(
  private http: HttpClient,
) {}


createandstrorePost(title: string, content: string){
  const postData: Post = {title: title, content: content}
  this.http.post<{name: string}>(this.urlLink, postData)
  .subscribe(resData => {
    console.log(resData);
  }, error => {
     this.error.next(error.message);
  });
}

  fetchPosts(){
    //New Parameters for Searching
    let searchParams = new HttpParams();
    searchParams = searchParams.append('print', 'pretty');
    searchParams = searchParams.append('customs', 'key');

   return this.http.get<{[key: string]: Post}>(this.urlLink,
    {
    headers: new HttpHeaders({'Content-Type': 'application/json', 'Custom-Header': 'Hello'}),
    params: searchParams
   })
    .pipe(
      map(responseData => {
        const PostArray: Post[] = [];
        for(const key in responseData) {
          if(responseData.hasOwnProperty(key)){
            PostArray.push({...responseData[key], id: key});
          }
      }
      return PostArray;
    }),
    catchError(errorRes => {
      return throwError(errorRes);
    })
    )
  }

  deletePosts(){
    return this.http.delete(this.urlLink);
  }

}
