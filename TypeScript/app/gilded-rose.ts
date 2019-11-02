const deltaQ:number = 1;

export class Item {
    name: string;
    sellIn: number;
    quality: number;

    constructor(name, sellIn, quality) {
        this.name = name;
        this.sellIn = sellIn;
        this.quality = quality;
    }
}

export class GildedRose {
    items: Array<Item>;

    constructor(items = [] as Array<Item>) {
        this.items = items;
    }

    // Backstage passes increase in value more rapidly as their sellIn date approaches
    updateBackstage(i: Item): Item {
        if      (i.sellIn < 0)  { i.quality  = 0; } // Passes are worthless after the sellIn date passes
        else if (i.sellIn < 5)  { i.quality += 3; } // +1 when it's further out than 10 days
        else if (i.sellIn < 10) { i.quality += 2; } // +2 when it's nearer than 10 days but further out than 5 days
        else                    { i.quality += 1; } // +3 when it's nearer than 5 days
        return i;
    }

    // Middleware function - Ensures that quality stays between 0 and 50
    boundQuality(f: (i: Item) => Item): (i: Item) => Item {
        return function(i: Item){
            var r: Item = f(i)
            if(r.quality > 50) { r.quality = 50; }
            if(r.quality < 0) { r.quality = 0; }
            return r;
        }
    }

    // Middleware function - decrements the sellIn time of the parameter of the given function
    aged(f: (i: Item) => Item): (i: Item) => Item {
        return function(i: Item){ i.sellIn--; return f(i) }
    }

    // Choose the appropriate logic for updating an item, dependant on its name
    dispatch(i: Item): Item {
        var fnDict =
            // Aged Brie gains value every day to a max of 50, and gains value twice as fast after the sellIn date
            { "Aged Brie"                                 : this.aged(function(i: Item){i.quality += deltaQ * i.sellIn >= 0 ? 1 : 2; return i})
            , "Backstage passes to a TAFKAL80ETC concert" : this.aged(this.updateBackstage)
            // Legendary items like Sulfuras do not change or expire in any way
            , "Sulfuras, Hand of Ragnaros"                : function(i: Item) {return i;}
            // Conjured items decrease in value twice as fast as normal items, and four times as fast after their sellIn date
            , "Cojured Mana Cake"                        : this.aged(function(i: Item){i.quality -= deltaQ * i.sellIn >= 0 ? 2 : 4; return i})
            };
        // If the item is not found in the dispatch map, treat it as a normal item:
        // It decreases in value every day to a minimum of 0, and does so twice as fast after its sellIn date
        return this.boundQuality((fnDict[i.name] || this.aged(function(i){i.quality -= deltaQ * i.sellIn >= 0 ? 1 : 2; return i})))(i);
    }

    updateQuality() {
        this.items = this.items.map(this.dispatch, this);
        return this.items;
    }
}
