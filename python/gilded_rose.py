# -*- coding: utf-8 -*-
"""
Manage the supply of the Gilded Rose Inn.

Classes:
    GildedRose - A store that sells perishable items
    Item - A perishable item to be sold.
"""

class GildedRose(object):
    """
    Stores a collection of items and maintains their prices day to day.

    Member variables:
        items - An array of Item objects to be tracked

    Methods:
        update_quality - Adjusts the quality of each item as time passes
        cast_class - Selects the appropriate type of item
    """

    def __init__(self, items):
        self.items = items

    def cast_class(self, item):
        """Changes the type of the provided item depending on its name."""
        if item.name == "Sulfuras, Hand of Ragnaros":
            item.__class__ = LegendaryItem
        elif item.name == "Aged Brie":
            item.__class__ = AgingCheese
        elif item.name == "Backstage passes to a TAFKAL80ETC concert":
            item.__class__ = BackstagePass
        elif item.name == "Conjured Mana Cake":
            item.__class__ = ConjuredItem
        else:
            item.__class__ = NormalItem

    def update_quality(self):
        """Iterates over every item in the Inn and ages it one day."""
        for item in self.items:
            self.cast_class(item)
            item.update()

class Item:
    """
    A generic Item.

    Update is not implemented in

    OFF LIMITS Cannot be changed

    If changing the Item class *were* permitted, a composition approach to the problem
    would have also been possible, wherein instead of subclasses of Item with their
    own update() methods, Item could contain an instance of an Updater class. This
    would allow the logic for associating name to update() to be done just once
    in the Item constructor, rather than needing to be done outside it and repeatedly
    in cast_class.

    Member variables:
        name - The name of the object. Used to determine how to update it
        sell_in - How many days until the item expires
        quality - How valuable the item still is. Must be between 0 and 50
    """

    def __init__(self, name, sell_in, quality):
        self.name = name
        self.sell_in = sell_in
        self.quality = quality

    def __repr__(self):
        return "%s, %s, %s" % (self.name, self.sell_in, self.quality)

class NormalItem(Item):
    """Normal Items degrade in value by 1 each day until expired, 2 afterwards."""

    def update(self):
        self.sell_in -= 1
        self.quality -= 1 if self.sell_in >= 0 else 2
        if self.quality < 0: self.quality = 0

class AgingCheese(Item):
    """Aging Cheeses increase in value by 1 each day until expired, 2 afterwards."""

    def update(self):
        self.sell_in -= 1
        self.quality += 1 if self.sell_in >= 0 else 2
        if self.quality > 50: self.quality = 50

class BackstagePass(Item):
    """
    Backstage passes increase in value more quickly the sooner they expire, and become worthless after.

    The rate of change is:
    More than ten days from expiring -> 1
    Between 5 and 10 days from expring -> 2
    5 or fewer days from expriing -> 3
    Already expried -> quality is always 0
    """

    def update(self):
        if self.sell_in > 10 :
            self.quality += 1
        elif 10 >= self.sell_in > 5:
            self.quality += 2
        else:
            self.quality += 3
        self.sell_in -= 1
        if self.sell_in < 0:
            self.quality = 0
        if self.quality > 50: self.quality = 50

class ConjuredItem(Item):
    """Conjured items degrade in quality twice as fast as normal items."""

    def update(self):
        self.sell_in -= 1
        self.quality -= 2 if self.sell_in >= 0 else 4
        if self.quality < 0: self.quality = 0

class LegendaryItem(Item):
    """Legendary items do not expire or change in value."""

    def update(self):
        pass
