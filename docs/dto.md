# Base classes
## DtoGetBase
- contains all the fields of BaseEntity
```typescript
export interface DtoBase {
  id: number;
  name: string;
  created: Date;
  modified: Date;
  version: number;
}
```
## DtoListBase
- contains name and id
```typescript
export interface DtoListBase {
  id: number;
  name: string;
}
```

## DtoNewBase
- contains name
```typescript
export interface DtoNewBase {  
  name: string;
}
```

## DtoSetBase
- contains name
```typescript
export interface DtoNewBase {  
  name: string;
}
```

# Implementations
## DtoGet*
- Contains all fields of the entity. Eventually enriched with data from linked entities.
- Given as input for edit or view detail dialogs.
-
```typescript
export interface DtoGetCollection extends DtoGetBase {
  path: string;
}
```

## DtoNew*
The data to be used to create a new entitity
```typescript
export interface DtoNewCollection {
  name: string;
  path: string;
}
```

## DtoSet*
Contains all editable fields of the entity.
Used to save changes.
```typescript
export interface DtoSetCollection extends DtoBase {
  name: string;
  path: string;
}
```

## DtoList*
Contains the data to be used in overviews
```typescript
export interface DtoListCollection extends DtoListBase {
  id
  name: string;
  path: string;
  pictures: number;
}
```
