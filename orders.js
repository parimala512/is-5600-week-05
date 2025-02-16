// orders.js
const cuid = require('cuid')

const db = require('./db')

const Order = db.model('Order', {
  _id: { type: String, default: cuid },
  buyerEmail: { type: String, required: true },
  products: [{
    type: String,
    ref: 'Product', // ref will automatically fetch associated products for us
    index: true,
    required: true
  }],
  status: {
    type: String,
    index: true,
    default: 'CREATED',
    enum: ['CREATED', 'PENDING', 'COMPLETED']
  }
})

/**
 * List orders
 * @param {Object} options
 * @returns {Promise<Array>}
 */
async function list(options = {}) {

  const { offset = 0, limit = 25, productId, status } = options;

  const productQuery = productId ? {
    products: productId
  } : {}

  const statusQuery = status ? {
    status: status
  } : {}

  const query = {
    ...productQuery,
    ...statusQuery
  }

  const orders = await Order.find(query)
    .sort({ _id: 1 })
    .skip(offset)
    .limit(limit)

  return orders
}

/**
 * Get an order
 * @param {Object} order
 * @returns {Promise<Object>}
 */
async function get (_id) {
  // using populate will automatically fetch the associated products.
  // if you don't use populate, you will only get the product ids
  const order = await Order.findById(_id)
    .populate('products')
    .exec()
  
  return order
}

/**
 * Create an order
 * @param {Object} order
 * @returns {Promise<Object>}
 */
async function create (fields) {
  const order = await new Order(fields).save()
  await order.populate('products')
  return order
}
const orders = []; // Simulated orders database

module.exports = {
    edit,
    destroy
};

/**
 * Edit an existing order.
 * @param {string} _id - The ID of the order to update.
 * @param {object} changes - The object containing updated values.
 * @returns {object|null} - The updated order, or null if not found.
 */
function edit(_id, changes) {
    const index = orders.findIndex(order => order._id === _id);
    if (index === -1) return null; // Order not found

    orders[index] = { ...orders[index], ...changes }; // Merge changes
    return orders[index]; // Return updated order
}

/**
 * Delete an existing order.
 * @param {string} _id - The ID of the order to delete.
 */
function destroy(_id) {
    const index = orders.findIndex(order => order._id === _id);
    if (index !== -1) {
        orders.splice(index, 1); // Remove order from array
    }
}
