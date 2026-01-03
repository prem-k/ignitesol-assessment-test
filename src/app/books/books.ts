import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { Api } from '../shared/services/api';
import { debounceTime, distinctUntilChanged, filter, Subject, switchMap, takeUntil } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LoadMoreDirective } from '../shared/directives/load-more';
import { Loader } from '../shared/loader/loader';

@Component({
  selector: 'app-books',
  imports: [
    FormsModule,
    RouterLink,
    LoadMoreDirective,
    Loader
  ],
  templateUrl: './books.html',
  styleUrl: './books.scss',
})
export class Books implements OnInit, OnDestroy {

  mime_type = 'image/jpeg';
  languages = 'fr,fi';
  page = signal(1);
  loading = signal(false);
  
  categoryName = signal('');
  searchVal = '';

  booksArr:any = signal([]);
  nextPage:any = signal('')

  searchSubject = new Subject<string>();
  loadMoreSubject = new Subject<string>();
  destroy$ = new Subject<void>();

  constructor(private api:Api, private activatedRoute:ActivatedRoute) {
    this.activatedRoute.queryParams.subscribe((queryParams:any)=>{
      const name = this.ucFirst(queryParams.category);
      this.categoryName.set(name)
    });
  }

  ngOnInit(): void {
    this.initSearchBooks();
    this.initLoadMoreBooks();
    this.onSearch();
  }

  ucFirst(str:any) {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  resetSearch() {
    this.searchVal = '';
    this.onSearch('')
  }

  getParams(text:any = '') {
    let queryParams:any = {
      search: text,
      page: this.page(),
      mime_type: this.mime_type,
      languages: this.languages,
      category: this.categoryName()
    };
    if(text) {
      queryParams['search'] = text;
    }
    return queryParams;
  }

  setNextPage(urlString:any) {
    const url = new URL(urlString);
    const page = url.searchParams.get('page');
    const pageNumber = Number(page) || 1; 
    this.page.set(pageNumber);
  }

  initSearchBooks() {
    this.loading.set(true)
    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((text:any) =>{
        const queryParams = this.getParams(text);
        return this.api.getBooks(queryParams)
      }),
      takeUntil(this.destroy$)
    ).subscribe((books:any) => {
      this.loading.set(false);
      this.setNextPage(books?.next);
      this.booksArr.set(books.results);
    });
  }

  initLoadMoreBooks() {
    this.loading.set(true)
    this.loadMoreSubject.pipe(
      debounceTime(400),
      switchMap((text:any) =>{
        const queryParams = this.getParams(text);
        return this.api.getBooks(queryParams)
      }),
      takeUntil(this.destroy$)
    ).subscribe((books:any) => {
      this.loading.set(false);
      this.setNextPage(books?.next);
      this.booksArr.update((prevArr:any)=> [...prevArr, ...books.results]);
    });
  }

  onSearch(value: any = ''): void {
    this.page.set(1)
    this.searchVal = value;
    this.searchSubject.next(value.trim());
  }

  loadMore = () => {
    const search:any = this.searchVal;
    this.loadMoreSubject.next(search);
  }

  getBookTittle(title:string) {
    if(title && title.length > 30) {
      return title.substring(0, 30)
    }
    return title;
  }

  getBookAuthor(author:string) {
    if(author && author.length > 15) {
      return author.substring(0, 15)
    }
    return author;
  }

  getPriortyImage(book:any) {
    return book?.formats['image/jpeg'];
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
