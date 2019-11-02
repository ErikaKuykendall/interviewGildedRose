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

    updateNormal(i: Item) {
        var n: Item =  new Item(i.name, i.sellIn, i.quality);
        if (n.quality > 0) {
            n.quality -= deltaQ;
        }
        n.sellIn--;
        if (n.sellIn < 0) {
            if (n.quality > 0) {
                n.quality -= deltaQ;
            }
        }
        return n;
    }

    updateCheese(i: Item) {
        var n: Item =  new Item(i.name, i.sellIn, i.quality);
        if (n.quality < 50) {
            n.quality += deltaQ;
        }
        n.sellIn--;
        if (n.sellIn < 0) {
            if (n.quality < 50) {
                n.quality += deltaQ;
            }
        }
        return n;
    }

    updateBackstage(i: Item) {
        var n: Item =  new Item(i.name, i.sellIn, i.quality);
        if (n.quality < 50) {
            n.quality += deltaQ;
            if (n.sellIn < 11) {
                if (n.quality < 50) {
                    n.quality += deltaQ;
                }
            }
            if (n.sellIn < 6) {
                if (n.quality < 50) {
                    n.quality += deltaQ;
                }
            }
        }
        n.sellIn--;
        if (n.sellIn < 0) {
            n.quality = n.quality - n.quality
        }
        return n;
    }

    updateLegendary(i: Item) { return i; }

    dispatch =
        { "Aged Brie": this.updateCheese
          , "Backstage passes to a TAFKAL80ETC concert": this.updateBackstage
          , "Sulfuras, Hand of Ragnaros": this.updateLegendary 
        };

    updateQuality() {
        for (let i = 0; i < this.items.length; i++) {
            this.items[i] = (this.dispatch[this.items[i].name] || this.updateNormal)(this.items[i]);
        }

        return this.items;
    }
}
