"use strict"

/** Some classes are inherited from a parent class to reduce code duplication */

import { TYPES } from '../../common/index.js'

export class Item {
  constructor(id, name, icon, price, cursor) {
    this.id = id
    this.name = name
    this.icon = icon
    this.price = price
    this.cursor = cursor
  }
}

export class Product extends Item {
  constructor(id, name, icon, price, cursor) {
    super(id, name, icon, price, cursor)
    this.type = TYPES.PRODUCT
  }
}

export class Developer extends Item {
  constructor(id, name, icon, price, cursor, skills, expense) {
    super(id, name, icon, price, cursor)
    this.skills = skills
    this.expense = expense
    this.type = TYPES.DEVELOPER
  }
}

export class Job {
  constructor(id, title, reward, company, duration, requirements, points) {
    this.id = id;
    this.title = title;
    this.reward = reward
    this.company = company
    this.duration = duration
    this.requirements = requirements
    this.points = points
    this.type = TYPES.JOB
  }
}

export class Requirement {
  constructor(title, icon, prefix, palette) {
    this.title = title
    this.icon = icon
    this.prefix = prefix
    this.palette = palette
    this.type = TYPES.REQUIREMENT
  }
}