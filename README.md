# fuzzy-potato


### State Objects
Vuex managed objects are accessible throughout the application. The shared state is a combination of four objects: functions, pobjects, blocks and values. ***functions*** contain the operations available to the user. On the UI, functions are listed under "Types". ***pobjects*** store the state of the bench. Each bench item has an equivalent object in the pobjects. The state of the shop is tracked by ***blocks***. As the name suggests, ***values*** contains the value associated with functions, pobjects and the blocks. 

#### functions
* Functions show up as types on the UI.
* They are the building blocks used to create complex objects.
* Each function has a unique name.

#### pobjects
* Each pobject has a unique id.
* The bench supports saving the pobjects to a file.

#### blocks
* A user can save the shop or load new blocks.

#### values
* A function has string values
* pobjects and blocks have promise values.

### UI Operations
#### Type to the bench
* A ***function*** or ***type*** dropped over the bench becomes a pobject.
* The pobject gets a random id. The function is inserted as its child.

#### Pobject to the shop
* When a pobject is dropped over the shop, it becomes a block.
* Blocks are identical to the pobjects.

#### Block to the bench
* When a ***block*** is dropped, it is added as a pobject to the bench.
* The new pobject is assigned a random id.