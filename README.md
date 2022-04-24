# Tezplorer
Powered by [Tezgraph](www.tezgraph.com)

## Run Project Locally
In one terminal:
```
npm install 
npm run dev
```
In another terminal:
```
cd vue-client
npm run serve
```
Go to `http://localhost:3000/`

## Features:

### SUBSCRIPTION
The `SUBSCRIPTION` page allows the user to subscribe all upcoming or recent operations of an implicit or originated Tezos account address.

<img src="./public/sub-with-new.png">

#### Subscribing to A Tezos Account Address
In the sidebar of the Subscription page, enter a Tezos Account Address. Under the `Operation Kind` section, select an operation kind (the default is Transactions). You may also subscribe to up to 100 blocks before the current head by using the `Replay` options. After you have set your desired configurations, click `SUBSCRIBE`. Tezplorer will then display all of the incoming operations performed by the provided Tezos account address.

### RECENT LEDGERS
The `RECENT LEDGERS` page allows the user to retrieve all of the most recently created ledgers, along with their contract metadata and their origination operation details.

<img src="./public/ledgers.png">

### BIG FISH
The `BIG FISH` page allows the user to retrieve all of the recent transcation operations moving large amounts of Tez. 

<img src="./public/big-fish.png">

#### Expanded Views
Both the records displayed on the `BIG FISH` page and the `RECENT LEDGERS` page can be clicked and viewed in a pop-up window providing greater detail. 