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
        i.quality -= deltaQ;
        i.sellIn--;
        if (i.sellIn < 0) {
            i.quality -= deltaQ;
        }
        return i;
    }

    updateCheese(i: Item): Item {
        i.quality += deltaQ;
        i.sellIn--;
        if (i.sellIn < 0) {
            i.quality += deltaQ;
        }
        return i;
    }

    updateBackstage(i: Item): Item {
            i.quality += deltaQ;
            if (i.sellIn < 11) {
                i.quality += deltaQ;
            }
            if (i.sellIn < 6) {
                i.quality += deltaQ;
            }
        i.sellIn--;
        if (i.sellIn < 0) {
            i.quality = i.quality - i.quality
        }
        return i;
    }

    updateLegendary(i: Item): Item { return i; }

    boundedQuality(i: Item): Item {
        if(i.quality > 50) i.quality = 50;
        if(i.quality < 0) i.quality = 0;
        return i;
    }

    dispatch(i: Item): Item
    {
        var fnDict =
            { "Aged Brie": this.updateCheese
            , "Backstage passes to a TAFKAL80ETC concert": this.updateBackstage
            , "Sulfuras, Hand of Ragnaros": this.updateLegendary 
            };
        return this.boundedQuality((fnDict[i.name] || this.updateNormal)(i));
    }

    updateQuality() {
        this.items = this.items.map(this.dispatch, this);

        return this.items;
    }
}
