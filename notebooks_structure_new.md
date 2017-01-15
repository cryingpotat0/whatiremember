# Notebooks & Lines Schema Outline
Notebook = {
  title: required
  creator: required
  creatorId: indexed required
  lines: array of line ids
  access: required public/private
  show: required public/private
  createdAt: required
  updatedAt: required
  upvotes: array of users who upvoted 
  downvotes: array of users who downoted
}

Line = {
  content: required sanitize HTML
  order: required number from 1-10
  creator: required
  creatorId: indexed required
  createdAt: required
  updatedAt: required
  upvotes: array of users who upvoted 
  notebook: required populate creator notebook
  downvotes: array of users who downoted
  netvotes: virtualattribute, ( count(upvotes) - count(downvotes) )/ totalCount
  nettime: virtualattribute, (currentTime - updatedAt) / currentTime
  score: virtualattribute, combination of netvotes and nettime
}

# Notebooks and Lines REST API
GET /notebooks -> userSignedIn? -> getPrivateNotebooks -> Paginated
GET /public/notebooks -> getNotebooksWithShowPublic -> Paginated
GET /notebook/:notebookId -> checkNotebookShowAccess -> getNotebookPopulatedWithLinesInOrderDependingOnTypeOfNotebook -> Paginated if public notebook
POST /notebook -> userSignedIn? -> createNewPrivateNotebook /* No lines in the notebook. Redirect to edit notebook page */
POST /public/notebook -> userSignedIn? -> createNewPublicNotebook /* No lines in the notebook. Redirect to edit notebook page */
PATCH /notebook/:notebookId -> checkUserNotebookAccess -> allowChangeToOnlyTitleAccessShow /*gets an array containing the lines to be edited, confirm that the current user has access to edit these lines and then change them */
DELETE /notebook/:notebookId -> checkuserNotebookAccess /* Only notebook creators can delete their notebooks */
DELETE notebook/:notebookId&:lineId -> checkuserLineAccess /* Only notebook creators can delete their notebooks */

SOCKET? -> Real time voting updates -> checkCurrentUserHasVoted -> Update vote or create new vote

# Client Side Thoughts
Get public/private notebooks page uses notebook-block -> Pass notebook creatorId to notebook-block, decide whether to show edit and delete actions
Create new notebook and create new public notebook are just buttons that create the notebook and redirect to the edit page
Edit notebook page 
  >Check if notebook is public or private. If private access, generate all lines as editable text fields
  >displays all the lines plus one extra box on the frontend for new content, can cross check if user edits this content and decide whether to post it. This additional box will be at the top.
  >for private notebooks use the voting anchors as rearrange anchors, edit the line order in the frontend and backend use these as related hooks
  >for public notebooks just display voting anchors. Ordering based on score
  >For public notebooks get lines, generate each TextEditor individually through angular, checking if it should be editable or not. Angular keeps track of current users editable lines and sends only the data from these lines back to /notebook/:notebookId as a patch.
