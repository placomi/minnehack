```mermaid
erDiagram
    Posts {
        STRING PK "geohash"
        STRING SK "timestamp#id"
        STRING summary
        STRING text
        STRING created_by
        TEXT scraped "twitter/internal"
        NUMBER upvotes
        NUMBER downvotes
        BOOLEAN verified
        STRING verified_at
        STRING verified_by
        NUMBER lat
        NUMBER long
        NUMBER radius
        LIST tags
    }
```