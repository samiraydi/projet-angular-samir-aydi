import { Injectable } from '@angular/core';
import { getGlobal, setGlobal } from 'src/app/app-config';
import { Article } from 'src/models/article.model';
import { AuthService } from '../AuthService';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  constructor(private authService: AuthService) {}

  private getArticles(): Article[] {
    return getGlobal()['articles']
      .map((article: Article) => ({
        ...article,
        appearanceDate: new Date(article.appearanceDate),
        author_id: this.authService.currentUserState.id
      }));
  }

  private setArticles(articles: Article[]): void {
    setGlobal({
      ...getGlobal(),
      articles: articles.map(article => ({
        ...article,
        appearanceDate: article.appearanceDate.getTime()
      }))
    });
  }

  getById(id: string): Promise<Article | null> {
    return Promise.resolve(this.getArticles().find(item => item.id === id) || null);
  }

  getAll(): Promise<Article[]> {
    return Promise.resolve(this.getArticles());
  }

  addArticle(article: Article): Promise<Article> {
    article = this.prepareArticleToSave(article);
    this.saveArticle(article);
    return Promise.resolve(article);
  }

  edit(id: string, article: Article): Promise<Article | null> {
    const articles = this.getArticles();
    const articleIndex = articles.findIndex(item => item.id === id);

    if (articleIndex === -1) {
      return Promise.resolve(null);
    }
    articles[articleIndex] = this.prepareArticleToEdit(articles[articleIndex], article);
    this.setArticles(articles);

    return Promise.resolve(articles[articleIndex]);
  }

  delete(id: string): Promise<void> {
    const articles = this.getArticles();
    this.setArticles(articles.filter(item => item.id !== id));
    return Promise.resolve();
  }

  private prepareArticleToSave(article: Article): Article {
    const creationDate = new Date();
    return {
      ...article,
      id: creationDate.getTime().toString(),
      appearanceDate: creationDate,
      author_id: this.authService.currentUserState.id
    };
  }

  private prepareArticleToEdit(articleOldData: Article, articleNewData: Article): Article {
    return {
      ...articleNewData,
      id: articleOldData.id,
      appearanceDate: articleOldData.appearanceDate,
      author_id: articleOldData.id
    };
  }

  private saveArticle(article: Article) {
    const articles = this.getArticles();
    articles.push(article);
    this.setArticles(articles);
  }
}
