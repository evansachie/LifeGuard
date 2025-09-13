from langgraph.graph import MessagesState
from typing import Optional

class GraphState(MessagesState):
     rewrite_count: Optional[int] = 0 
     user_id : str