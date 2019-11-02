import { expect } from 'chai';
import { Item, GildedRose } from '../app/gilded-rose';

function assertArraysEq(a1: Array<number>, a2: Array<number>){
    expect(a1.length).to.equal(a2.length);
    a1.forEach(function(item: number, index: number) {expect(item).to.equal(a2[index]);});
}

//Ensure that the item is being created as we expect it to.
it('Trivial Case', function () {
    var items: Array<Item> = [new Item("item", 10, 20)];
    var gildedRose: GildedRose = new GildedRose(items);
    expect(gildedRose.items[0].name)   .to.equal("item");
    expect(gildedRose.items[0].sellIn) .to.equal(10);
    expect(gildedRose.items[0].quality).to.equal(20);
});

// The value of normal items should decrement by 1 until they reach zero,
// provided that their sell_in date is not reached by the time they become
// worthless.
it('Normal Item', function () {
    var items: Array<Item> = [new Item("item", 10, 10)];
    var gildedRose: GildedRose = new GildedRose(items);
    var qualities: Array<number> = [gildedRose.items[0].quality];
    while(gildedRose.items[0].quality > 0) {
        gildedRose.updateQuality();
        qualities.push(gildedRose.items[0].quality);
    }
    assertArraysEq(qualities, [10,9,8,7,6,5,4,3,2,1,0]);
});

// Normal items begin decrementing in value by 2 when their sell_in date is reached.
it('Normal Item Sell By Date', function () {
    var items: Array<Item> = [new Item("item", 5, 10)];
    var gildedRose: GildedRose = new GildedRose(items);
    var qualities: Array<number> = [gildedRose.items[0].quality];
    while(gildedRose.items[0].quality > 0) {
        gildedRose.updateQuality();
        qualities.push(gildedRose.items[0].quality);
    }
    assertArraysEq(qualities, [10,9,8,7,6,5,3,1,0]);
});

// Aged Brie increases in value by 1 every day instead of decreasing.
it('Aged Brie', function () {
    var items: Array<Item> = [new Item("Aged Brie", 40, 10)];
    var gildedRose: GildedRose = new GildedRose(items);
    var qualities: Array<number> = [gildedRose.items[0].quality];
    while(gildedRose.items[0].quality < 50) {
        gildedRose.updateQuality();
        qualities.push(gildedRose.items[0].quality);
    }
    assertArraysEq(qualities, [10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50]);
});

// Similarly, when the sell_in date is reached, it begins increasing by 2
// each day. It should never exceed 50.
it('Aged Brie Sell By Date', function () {
    var items: Array<Item> = [new Item("Aged Brie", 5, 10)];
    var gildedRose: GildedRose = new GildedRose(items);
    var qualities: Array<number> = [gildedRose.items[0].quality];
    while(gildedRose.items[0].quality < 50) {
        gildedRose.updateQuality();
        qualities.push(gildedRose.items[0].quality);
    }
    assertArraysEq(qualities, [10,11,12,13,14,15,17,19,21,23,25,27,29,31,33,35,37,39,41,43,45,47,49,50]);
});

// Backstage Passes should behave identically to Brie, so long as the sell_in
// date is sufficiently far away. (at least 10 days into the future)
it('Backstage Pass', function () {
    var items: Array<Item> = [new Item("Backstage passes to a TAFKAL80ETC concert", 100, 10)];
    var gildedRose: GildedRose = new GildedRose(items);
    var qualities: Array<number> = [gildedRose.items[0].quality];
    while(gildedRose.items[0].quality < 50) {
        gildedRose.updateQuality();
        qualities.push(gildedRose.items[0].quality);
    }
    assertArraysEq(qualities, [10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50]);
});

// When the sell_in day is smaller, backstage passes increment faster the
// nearer it is: by 2 if it is 10 or fewer days away, by 3 when it is 5 or
// fewer days away. When it passes, however, they become worthless.
it('Backstage Pass', function () {
    var items: Array<Item> = [new Item("Backstage passes to a TAFKAL80ETC concert", 30, 10)];
    var gildedRose: GildedRose = new GildedRose(items);
    var qualities: Array<number> = [gildedRose.items[0].quality];
    while(gildedRose.items[0].quality != 0) {
        gildedRose.updateQuality();
        qualities.push(gildedRose.items[0].quality);
    }
    assertArraysEq(qualities, [10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,32,34,36,38,40,43,46,49,50, 50, 0]);
});

// Sulfuras should simply never change in value or date.
it('Sulfuras', function () {
    var items: Array<Item> = [new Item("Sulfuras, Hand of Ragnaros", 10, 10)];
    var gildedRose: GildedRose = new GildedRose(items);
    gildedRose.updateQuality();
    expect(gildedRose.items[0].sellIn) .to.equal(10);
    expect(gildedRose.items[0].quality).to.equal(10);
});

// Ensure that multiple items are all properly adjusted at once.
it('Multiple Items', function () {
    var items: Array<Item> =
        [ new Item("item", 10, 10)
        , new Item("Sulfuras, Hand of Ragnaros", 10, 10)
        , new Item("Aged Brie", 10, 10)
        , new Item("Backstage passes to a TAFKAL80ETC concert", 10, 10)
        ];
    var gildedRose: GildedRose = new GildedRose(items);
    gildedRose.updateQuality();
    assertArraysEq(gildedRose.items.map(function(x: Item){return x.quality;}), [9,10,11,12]);
});


// Ensure that the value of any item never exceeds 50 or drops below 0
it('Multiple Items', function () {
    var items: Array<Item> =
        [ new Item("item", 10, 10)
          , new Item("Sulfuras, Hand of Ragnaros", 10, 10)
          , new Item("Aged Brie", 10, 10)
          , new Item("Backstage passes to a TAFKAL80ETC concert", 10, 10)
        ];
    var gildedRose: GildedRose = new GildedRose(items);
    for(var i:number = 0; i < 100; i++){
        gildedRose.updateQuality();
        expect(gildedRose.items
               .map(function(x: Item){return x.quality >= 0 && x.quality <= 50;})
               .reduce(function(x,y){return x && y;})).to.equal(true);
    }
    assertArraysEq(gildedRose.items.map(function(x: Item){return x.quality}), [0,10,50,0]);
});

//Conjured items behave as normal items, except they lose value twice as quickly.
it('Conjured Item', function () {
    var items: Array<Item> = [new Item("Cojured Mana Cake", 10, 20)];
    var gildedRose: GildedRose = new GildedRose(items);
    var qualities: Array<number> = [gildedRose.items[0].quality];
    while(gildedRose.items[0].quality > 0) {
        gildedRose.updateQuality();
        qualities.push(gildedRose.items[0].quality);
    }
    assertArraysEq(qualities, [20,18,16,14,12,10,8,6,4,2,0]);
});

// When they reach their sell_in date, conjured items should decrease in
// value by 4 each day.
it('Conjured Item Sell By Date', function () {
    var items: Array<Item> = [new Item("Cojured Mana Cake", 5, 20)];
    var gildedRose: GildedRose = new GildedRose(items);
    var qualities: Array<number> = [gildedRose.items[0].quality];
    while(gildedRose.items[0].quality > 0) {
        gildedRose.updateQuality();
        qualities.push(gildedRose.items[0].quality);
    }
    assertArraysEq(qualities, [20,18,16,14,12,10,6,2,0]);
});
