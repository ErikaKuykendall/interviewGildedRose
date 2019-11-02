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

    updateNormal(i: Item): Item {
        i.quality -= deltaQ * i.sellIn >= 0 ? 1 : 2;
        return i;
    }

    updateCheese(i: Item): Item {
        i.quality += deltaQ * i.sellIn >= 0 ? 1 : 2;
        return i;
    }

    updateBackstage(i: Item): Item {
        if (i.sellIn < 0) {
            i.quality = 0
        }
        else if (i.sellIn < 5) {
            i.quality += 3;
        }
        else if (i.sellIn < 10) {
            i.quality += 2;
        }
        else {
            i.quality += 1;
        }
        return i;
    }

    updateLegendary(i: Item): Item { return i; }

    boundQuality(f: (i: Item) => Item): (i: Item) => Item {
        return function(i: Item){
            var r: Item = f(i)
            if(r.quality > 50) r.quality = 50;
            if(r.quality < 0) r.quality = 0;
            return r;
        }
    }

    aged(f: (i: Item) => Item): (i: Item) => Item {
        return function(i: Item){
            i.sellIn--;
            return f(i)
        }
    }

    dispatch(i: Item): Item
    {
        var fnDict =
            { "Aged Brie": this.aged(this.updateCheese)
            , "Backstage passes to a TAFKAL80ETC concert": this.aged(this.updateBackstage)
            , "Sulfuras, Hand of Ragnaros": this.updateLegendary 
            };
        return this.boundQuality((fnDict[i.name] || this.aged(this.updateNormal)))(i);
    }

    updateQuality() {
        this.items = this.items.map(this.dispatch, this);

        return this.items;
    }
}
