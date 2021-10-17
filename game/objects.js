class Item {
  constructor(id, name, icon, price, cursor) {
    this.id = id
    this.name = name
    this.icon = icon
    this.price = price
    this.cursor = cursor
  }
}

class Product extends Item {
  constructor(id, name, icon, price, cursor) {
    super(id, name, icon, price, cursor)
    this.type = TYPES.PRODUCT
  }
}

class Developer extends Item {
  constructor(id, name, icon, price, cursor, skills) {
    super(id, name, icon, price, cursor)
    this.skills = skills
    this.type = TYPES.DEVELOPER
  }
}

class Job {
  constructor(id, title, reward, company, duration, requirements) {
    this.id = id;
    this.title = title;
    this.reward = reward
    this.company = company
    this.duration = duration
    this.requirements = requirements
    this.type = TYPES.JOB
  }
}

class Requirement {
  constructor(title, icon, prefix, palette) {
    this.title = title
    this.icon = icon
    this.prefix = prefix
    this.palette = palette
    this.type = TYPES.REQUIREMENT
  }
}