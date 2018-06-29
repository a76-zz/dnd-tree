Drag and drop implementation is base on the [React DnD library](http://react-dnd.github.io/react-dnd/)
[Redux](https://redux.js.org/) is used for state management

My goal is not just to create the shortest implementation but create scalable loosely coupled solution
I believe that Redux or its alternatives are default architectural pattern of almost any react application today

## General idea

Tree is flatenized to the simple list of node views.
Each node view contains node as is and some additional data such as level, unique id and parent.
Flatenization is used for tree rendering.

Tree state contains tree structure and flatenization of it.
Each structural changes as add/remove items are followed by flatenization to reflect corresponding changes visually.

When drag and drop is performed only flatenization is changed.
It allows to manage drag and drop as simple list item drag and drop.
One siginificant difference is that not any position in the list is dropable and it is required to detect whether particular position is dropable or not.
That logic is the most difficult and important.

After drag and drop is completed on the drop phase it is necessary to detect which structural changes should be performed to receive completely equivalent vision after tree data flatenization.

So it is required to perform revers operation from flatenization to the tree data structure.

## Implementation assumptions

1. Node counter just displays number of childrens
2. Additional descriptions such as User/Level etc. are missed
3. Users are also draggables
4. Dropping after collapsed nodes is allowed and it causes expansion of such nodes after dropping
5. Some bugs are still possible :)
6. Use yarn package manager

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

Below you will find some information on how to perform common tasks.<br>
You can find the most recent version of this guide [here](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md).
