## Dto*
Contains all fields of the entity. Usually given as input for edit or view detail dialogs. Used to save changes
```typescript
export interface DtoGetCollection extends DtoBase {
  name: string;
  path: string;
}
```

## DtoList*
Contains the data to be used in overviews
```typescript
export interface DtoListCollection {
  id
  name: string;
  path: string;
  pictures: number;
}
```

## DtoNew*
The data to be used to create a new entitity
```typescript
export interface DtoSetCollection {
  name: string;
  path: string;
}
```
