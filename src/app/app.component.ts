import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Post } from './post.model';
import { PostService } from './posts.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  loadedPosts : Post[] = [];
  isFetching: boolean = false;
  error = null;
  private errorSub: Subscription;

@ViewChild("postForm") public postForm: NgForm;

  constructor(
    private http: HttpClient,
    private postService: PostService
    ) {}

  ngOnInit() {

    this.errorSub = this.postService.error.subscribe(err => {
      this.error = err;
    })

    this.isFetching = true;
    this.postService.fetchPosts().subscribe(posts => {
      this.isFetching = false;
      this.loadedPosts = posts;
    }, error => {
      this.isFetching = false;
      this.error = error.message;
    });
  }

  onCreatePost(postData: Post) {
    // Send Http request
   this.postService.createandstrorePost(postData.title, postData.content)
   if(postData){
    alert("Post Send Successfully");
    this.postForm.reset();
    this.onFetchPosts();
   }
  }

  onFetchPosts() {
    this.isFetching = true;
    this.postService.fetchPosts().subscribe(posts => {
      this.isFetching = false;
      this.loadedPosts = posts;
    }, error => {
      this.isFetching = false;
      this.error = error.message;
    });
  }

  onClearPosts() {
    // Send Http request
    this.postService.deletePosts().subscribe(()=> {
      this.loadedPosts = [];
    });
  }

  OnErrorHandling(){
    this.error = null;
  }

  ngOnDestroy(): void {
    this.errorSub.unsubscribe();
  }


}
