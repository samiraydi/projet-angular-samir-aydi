export enum ArticleTypes {
  NEWSPAPER_ARTICLE = 'Newspaper Article',
  BOOK = 'Book',
  BOOK_CHAPTER = 'Book chapter',
  POST = 'Post'
}

export interface Article {
  id: string;
  title: string;
  type: ArticleTypes;
  appearanceDate: Date;
  link: string;
  pdfSource: string;
  author_id: string;
  contributers_ids: string[];
}

