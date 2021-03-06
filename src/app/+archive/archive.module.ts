import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { CategoryComponent } from './category.component';
import { CategoriesService } from '../core/categorys.service';
import { RecentArticlesComponent } from '../recent-articles/recent-articles.component';

@NgModule({
  declarations: [CategoryComponent, RecentArticlesComponent],
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: CategoryComponent,
      },
    ]),
    CommonModule,
  ],
  providers: [Title, CategoriesService],
})
export class ArchiveModule {}
