---
category: Components
type: Navigation
title: Pagination
cols: 1
---

A long list can be divided into several pages by `Pagination`, and only one page will be loaded at a time.

## When To Use

- When it will take a long time to load/render all items.
- If you want to browse the data by navigating through pages.

## API

```html
<nz-pagination [nzPageIndex]="1" [nzTotal]="50"></nz-pagination>
```

### nz-pagination

| Property | Description | Type | Default |
| -------- | ----------- | ---- | ------- |
| `[nzTotal]` | total number of data items | `number` | `0` |
| `[nzPageIndex]` | current page number，double binding | `number` | `1` |
| `[nzPageSize]` | number of data items per page, double binding | `number` | `10`|
| `[nzShowQuickJumper]` | determine whether you can jump to pages directly | `boolean` | `false` |
| `[nzShowSizeChanger]` | determine whether `nzPageSize` can be changed | `boolean` | `false` |
| `[nzSimple]` | whether to use simple mode | `boolean` | - |
| `[nzSize]` | specify the size of `nz-pagination`, can be set to `small` | `'small'` | `""` |
| `[nzPageSizeOptions]` | specify the sizeChanger options | `number[]` | `[10, 20, 30, 40]` |
| `[nzItemRender]` | to customize item | `TemplateRef<{ $implicit: 'page'｜'prev'｜'next', page: number }>` | - |
| `[nzShowTotal]` | to display the total number and range | `TemplateRef<{ $implicit: number, range: [ number, number ] }>` | - |
| `[nzHideOnSinglePage]` | Whether to hide pager on single page | `boolean` | `false` |
| `(nzPageIndexChange)` | current page number change callback | `EventEmitter<number>` | - |
| `(nzPageSizeChange)` | number of data items per page change callback | `EventEmitter<number>` | - |
