from dataclasses import dataclass

@dataclass
class Snippet:
    """Class for keeping track of an item in inventory."""
    summary: str
    text: str
    created_by: str
    verified: bool
    lat: float
    Long: float
    tags: list[str]

    timestamp: float = 1.0
    scraped: str = 'twitter'


    

