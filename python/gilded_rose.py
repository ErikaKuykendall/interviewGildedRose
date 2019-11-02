# -*- coding: utf-8 -*-

class GildedRose(object):

    def __init__(self, items):
        self.items = items

    def cast_class(self, item):
        if item.name == "Sulfuras, Hand of Ragnaros":
            item.__class__ = LegendaryItem
        elif item.name == "Aged Brie":
            item.__class__ = AgingCheese
        elif item.name == "Backstage passes to a TAFKAL80ETC concert":
            item.__class__ = BackstagePass
        else:
            item.__class__ = NormalItem

    def update_quality(self):
        for item in self.items:
            self.cast_class(item)
            item.update()


class Item:
    def __init__(self, name, sell_in, quality):
        self.name = name
        self.sell_in = sell_in
        self.quality = quality

    def __repr__(self):
        return "%s, %s, %s" % (self.name, self.sell_in, self.quality)

class NormalItem(Item):
    def update(self):
        self.sell_in -= 1
        self.quality -= 2 if self.sell_in < 0 else 1
        if self.quality < 0: self.quality = 0

class AgingCheese(Item):
    def update(self):
        self.sell_in -= 1
        self.quality += 2 if self.sell_in < 0 else 1
        if self.quality > 50: self.quality = 50

class BackstagePass(Item):
    def update(self):
        self.quality += 1
        if self.sell_in <= 10 :
            self.quality += 1
        if self.sell_in <= 5:
            self.quality += 1
        self.sell_in -= 1
        if self.sell_in < 0:
            self.quality = 0
        if self.quality > 50: self.quality = 50

class LegendaryItem(Item):
    def update(self):
        pass
