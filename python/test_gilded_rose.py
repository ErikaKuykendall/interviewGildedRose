# -*- coding: utf-8 -*-
import unittest

from gilded_rose import Item, GildedRose

class GildedRoseTest(unittest.TestCase):
    # Ensure that the item is being created as we expect it to.
    def testTrivialCase(self):
        items = [Item("item", 10, 20)]
        gildedRose = GildedRose(items)
        self.assertEquals("item", items[0].name)
        self.assertEquals(10,     items[0].sell_in)
        self.assertEquals(20,     items[0].quality)

    # The value of normal items should decrement by 1 until they reach zero, 
    # provided that their sell_in date is not reached by the time they become 
    # worthless.
    def testNormalItem(self):
        items = [Item("item", 10, 10)]
        gildedRose = GildedRose(items)
        qualities = [items[0].quality]
        while items[0].quality > 0:
            gildedRose.update_quality()
            qualities.append(items[0].quality)
        self.assertEquals(qualities, range(10,-1,-1))

    # Normal items begin decrementing in value by 2 when their sell_in date is 
    # reached.
    def testNormalItemSellByDate(self):
        items = [Item("item", 5, 10)]
        gildedRose = GildedRose(items)
        qualities = [items[0].quality]
        while items[0].quality > 0:
            gildedRose.update_quality()
            qualities.append(items[0].quality)
        self.assertEquals(qualities,
                [10,9,8,7,6,5] +  # Before sell_in date reached
                [3,1] +           # After
                [0])              # Items cannot be worth less than zero

    # Aged Brie increases in value by 1 every day instead of decreasing.
    def testAgedBrie(self):
        items = [Item("Aged Brie", 40, 10)]
        gildedRose = GildedRose(items)
        qualities = [items[0].quality]
        while items[0].quality < 50:
            gildedRose.update_quality()
            qualities.append(items[0].quality)
        self.assertEquals(qualities, range(10,51))

    # Similarly, when the sell_in date is reached, it begins increasing by 2
    # each day. It should never exceed 50.
    def testAgedBrieSellByDate(self):
        items = [Item("Aged Brie", 5, 10)]
        gildedRose = GildedRose(items)
        qualities = [items[0].quality]
        while items[0].quality < 50:
            gildedRose.update_quality()
            qualities.append(items[0].quality)
        self.assertEquals(qualities, 
                range(10,16) +    # Before
                range(17,50,2) +  # After 
                [50])             # Items cannot be worth more than 50

    # Backstage Passes should behave identically to Brie, so long as the sell_in
    # date is sufficiently far away. (at least 10 days into the future)
    def testBackstagePass(self):
        items = [Item("Backstage passes to a TAFKAL80ETC concert", 100, 10)]
        gildedRose = GildedRose(items)
        qualities = [items[0].quality]
        while items[0].quality < 50:
            gildedRose.update_quality()
            qualities.append(items[0].quality)
        self.assertEquals(qualities, range(10,51))

    # When the sell_in day is smaller, backstage passes increment faster the 
    # nearer it is: by 2 if it is 10 or fewer days away, by 3 when it is 5 or 
    # fewer days away. When it passes, however, they become worthless.
    def testBackstagePassSellByDate(self):
        items = [Item("Backstage passes to a TAFKAL80ETC concert", 30, 10)]
        gildedRose = GildedRose(items)
        qualities = [items[0].quality]
        while items[0].quality != 0:
            gildedRose.update_quality()
            qualities.append(items[0].quality)
        self.assertEquals(qualities, 
                range(10,31) +      # More than 10 days from the sell_in date
                range(32, 41, 2) +  # 10 days 
                range(43, 50, 3) +  # 5 days
                [50, 50]            # Value cannot exceed 50
                +[0])               # The pass becomes worthless after the event

    # Sulfuras should simply never change in value or date.
    def testSulfuras(self):
        items = [Item("Sulfuras, Hand of Ragnaros", 10, 10)]
        gildedRose = GildedRose(items)
        gildedRose.update_quality()
        self.assertEquals(items[0].quality, 10)
        self.assertEquals(items[0].sell_in, 10)

    # Ensure that multiple items are all properly adjusted at once.
    def testMultipleItems(self):
        items = [Item("item", 10, 10),
                 Item("Sulfuras, Hand of Ragnaros", 10, 10),
                 Item("Aged Brie", 10, 10),
                 Item("Backstage passes to a TAFKAL80ETC concert", 10, 10)]
        gildedRose = GildedRose(items)
        gildedRose.update_quality()
        self.assertEquals([item.quality for item in items], [9, 10, 11, 12])

    # Ensure that the value of any item never exceeds 50 or drops below 0
    def testValueNeverLeavesBounds(self):
        items = [Item("item", 10, 10),
                 Item("Sulfuras, Hand of Ragnaros", 10, 10),
                 Item("Aged Brie", 10, 10),
                 Item("Backstage passes to a TAFKAL80ETC concert", 10, 10)]
        gildedRose = GildedRose(items)
        for _ in range(100):
            gildedRose.update_quality()
            self.assertTrue(reduce (lambda x, y: x and y, 
                [item.quality <= 50 and item.quality >= 0 for item in items]))
        self.assertEquals([item.quality for item in items], [0, 10, 50, 0])

    # Conjured items behave as normal items, except they lose value twice as
    # quickly.
    def testConjuredItem(self):
        items = [Item("Conjured Mana Cake", 10, 20)]
        gildedRose = GildedRose(items)
        qualities = [items[0].quality]
        while items[0].quality > 0:
            gildedRose.update_quality()
            qualities.append(items[0].quality)
        self.assertEquals(qualities, range(20,0,-2) + [0])

    # When they reach their sell_in date, conjured items should decrease in
    # value by 4 each day.
    def testConjuredItemSellByDate(self):
        items = [Item("Conjured Mana Cake", 5, 20)]
        gildedRose = GildedRose(items)
        qualities = [items[0].quality]
        while items[0].quality > 0:
            gildedRose.update_quality()
            qualities.append(items[0].quality)
        self.assertEquals(qualities, range(20,9,-2) + range(6,0,-4) + [0])

if __name__ == '__main__':
    unittest.main()
