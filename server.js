const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const knex = require('knex')
const knexConfig = require('./knexfile');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const verifyToken = require('./verifytoken');
const { default: axios } = require('axios');
const db = knex(knexConfig.development);
dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors())
app.use(bodyParser.json());

// db.raw('SELECT 1').then(()=> console.log('Database connected successfully')).catch((error)=> console.error('DaTABASE CONNECTION ERROR:', error.message));

const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
  };

const licensePattern = /^[A-Z0-9-]{8}$/

app.post('/signup/driver', async (req, res) => {

    const { name, username, email, password, license_number} = req.body;

    if (!licensePattern.test(license_number)) {
      return res.status(400).json({ error: `Invalid Driver's license Number` });
    }

    const trx = await db.transaction();

    try {

      const hashedPassword = await hashPassword(password);

      const role = await trx('roles')
      .select('role_id')
      .where('role_name', 'driver')
      .first();
  
      const [userId] = await trx('users')
        .insert({
            name,
            username,
            email,
            role_id: role.role_id,
            created_at: new Date(),
        })
        .returning('*'); 

        console.log('Inserted User:', userId);

        if(typeof userId.user_id !== 'number'){
          throw new Error(`Invalid user_id: ${userId.userId}`)
        }
  
        await trx('login')
        .insert({
            user_id: userId.user_id,
            username,
            password_hash: hashedPassword,
            created_at: new Date(),
        })
        .returning('*');
        
        await trx('drivers')
        .insert({
            user_id: userId.user_id,
            license_number: license_number,
        })
        .returning('*');
        
        await trx.commit();
        res.status(201).json('Driver signed up successfully');
    } catch (err) {
      await trx.rollback();
      console.error(err.message);
      res.status(500).json('Server error');
    }
  });

app.post('/signup/staff', async (req, res) => {

    const { name, username, email, password, employee_id_number} = req.body;
  
    const trx = await db.transaction();

    try {

      const hashedPassword = await hashPassword(password);

      const role = await trx('roles').select('role_id').where('role_name', 'staff').first();
  
      const [userId] = await trx('users')
      .insert({
        name,
        username,
        email,
        role_id: role.role_id,
        created_at: new Date(),
    })
    .returning('user_id');
  
      await trx('login')
      .insert({
        user_id: userId.user_id,
        username,
        password_hash: hashedPassword,
      })
      .returning('id');
  
      await trx('staffs').insert({
        user_id: userId.user_id,
        employee_id_number
      });
  
      await trx.commit();
      res.status(201).json('Staff signed up successfully');
    } catch (err) {
      await trx.rollback();
      console.error(err.message);
      res.status(500).json('Server error');
    }
  });
  
  
app.post('/signup/student', async (req, res) => {
    const { name, username, email, password, department } = req.body;
  
    const trx = await db.transaction();

    try {

      const hashedPassword = await hashPassword(password);

      const role = await trx('roles').select('role_id').where('role_name', 'student').first();
  
      const [userId] = await trx('users')
        .insert({
            name,
            username,
            email,
            role_id: role.role_id,
            created_at: new Date(),
        })
        .returning('user_id');
  
        await trx('login').insert({
            user_id: userId.user_id,
            username,
            password_hash: hashedPassword,
            created_at: new Date(),
        })
  
        await trx('students').insert({
            user_id: userId.user_id,
            department
        })
  
        await trx.commit();
        res.status(201).json('Student signed up successfully');
    } catch (err) {
      await trx.rollback();
      console.error(err.message);
      res.status(500).json('Server error');
    }
  });  

  app.post('/driver/create-bus', verifyToken, async (req, res) => {

    const { bus_number, route_name, fare_amount, seat_capacity, departure_time } = req.body;

    const driver_id = req.userId;
  
    try {
      const [busId] = await db('buses')
        .insert({
          bus_number,
          driver_id,
          seat_capacity
        })
        .returning('bus_id');

      await db('routes')
        .insert({
          bus_id: busId.bus_id,
          route_name,
          fare_amount,
          departure_time,
        })
        .returning('route_id');
  
      res.status(201).json({ message: 'Bus and route created successfully' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }); 

app.post('/login', async (req, res) => {

  const { username, password } = req.body;

  try {

    const user = await db('login').where({ username }).first();

    if (!user) {
      return res.status(400).json('Invalid username or password');
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      return res.status(400).json('Invalid username or password');
    }

    const userRole = await db('users')
      .join('roles', 'users.role_id', '=', 'roles.role_id')
      .where('users.user_id', user.user_id)
      .select('users.user_id', 'users.username', 'users.name', 'roles.role_name', 'roles.role_id')
      .first();

    if (!userRole || !userRole.role_id) {
      return res.status(400).json('User role not found or incorrect structure');
    }

    let hasBusRoute = false;

    if (userRole.role_name === 'driver') {
      const bus = await db('buses').where('buses.driver_id', user.user_id).first();
      if (bus) {
        hasBusRoute = true;
      }
    }

    const token = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET, {
      expiresIn: 86400,
    });

    res.status(200).json({
      message: 'Login successful',
      token,
      hasBusRoute,
      user: {
        user_id: userRole.user_id,
        username: userRole.username,
        name: userRole.name,
        role_id: userRole.role_id,
        role: userRole.role_name,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json('Server error');
  }
});

app.get('/available-buses', async (req, res) => {

  try {
    const buses = await db('buses')
      .join('users', 'buses.driver_id', '=', 'users.user_id')
      .join('routes', 'buses.bus_id', '=', 'routes.bus_id')
      .select(
        'users.name as driver_name', 
        'buses.bus_number', 
        'routes.route_name as route', 
        'routes.fare_amount', 
        'routes.departure_time',
        'buses.seat_capacity as seat_capacity'
      );

    res.status(200).json(buses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

app.get('/bus-seats/:bus_number', verifyToken, async (req, res) => {

  const { bus_number } = req.params;

  try {
    const bus = await db('buses')
      .where({ bus_number })
      .first();

    if (!bus) {
      return res.status(404).json({ error: 'Bus not found' });
    }

    const seats = await db('seats')
      .where('bus_id', bus.bus_id)
      .select('seat_id', 'seat_number', 'bus_number', 'status');

    if (seats.length < bus.seat_capacity) {
      for (let i = seats.length + 1; i <= bus.seat_capacity; i++) {
        await db('seats')
          .insert({
            bus_id: bus.bus_id,
            seat_number: i,
            bus_number: bus_number,
            status: 'available'
          });
      }
    }

    res.status(200).json(seats);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

app.get('/booked-seats/:bus_number', verifyToken, async (req, res) => {

  const { bus_number } = req.params;
  const user_id = req.userId;

  try {
    const bus = await db('buses')
      .where('bus_number', bus_number)
      .first();

    if (!bus) {
      return res.status(404).json({ error: 'Bus not found' });
    }

    const bookedSeats = await db('seats')
      .where({
        bus_id: bus.bus_id,
        user_id: user_id,
        status: 'booked'
      })
      .select('seat_number', 'user_id', 'status') 
      .first();

    if (!bookedSeats) {
      return res.status(200).json({ seat_number: null, user_id });
    } else {
      return res.status(200).json({ bookedSeats, user_id });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

app.get('/verify-payment/:reference', verifyToken, async (req, res) => {
  
  const secretKey = 'sk_test_f80dc18544c747243703356de35225567895159d';
  const { reference } = req.params;

  try {
    const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${secretKey}`
      }
    });

    const { status, data } = response.data;

    if (!status) {
      console.log('Payment verification failed:', response.data);
      return res.status(400).json({ message: 'Payment verification failed', data: response.data });
    }

    const { amount, metadata, created_at } = data;
    let bus_number, seat_number;

    if (metadata.custom_fields) {
      console.log('Custom Fields:', JSON.stringify(metadata.custom_fields, null, 2));
      const busNumberField = metadata.custom_fields.find(field => field.variable_name === 'bus_number');
      const seatNumberField = metadata.custom_fields.find(field => field.variable_name === 'seat_number');

      if (busNumberField && seatNumberField) {
        bus_number = busNumberField.value;
        seat_number = seatNumberField.value;
      }
    }

    if (!bus_number || !seat_number) {
      console.error('Missing bus_number or seat_number in metadata');
      return res.status(400).json({ message: 'Missing bus_number or seat_number in metadata' });
    }

    await db.transaction(async (trx) => {
      const user = await trx('users').where('user_id', req.userId).first();

      if (!user) {
        return res.status(400).json({ message: 'User not found!' });
      }

      const existingTransaction = await trx('transactions')
        .where({
          bus_number,
          seat_number,
          reference,
          transaction_date: created_at,
          payment_status: 'paid'
        })
        .first();

      if (existingTransaction) {
        return res.status(400).json({ message: 'Transaction already exists!' });
      }

      await trx('transactions')
      .insert({
        user_id: user.user_id,
        bus_number,
        seat_number,
        payment_status: 'paid',
        amount: amount / 100,
        reference,
        transaction_date: created_at
      });

      console.log(`Transaction inserted successfully for reference: ${reference}`);
      res.status(200).json({ message: 'Payment verified successfully', data });
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ message: 'Error verifying payment', error: error.message });
  }
});

app.get('/transaction-params', verifyToken, async (req, res) => {
  
  try {
    const user_id = req.userId; 
    const transaction = await db('transactions')
      .where('user_id', user_id)
      .first();

    if (transaction) {
      res.status(200).json({
        bus_number: transaction.bus_number,
        seat_number: transaction.seat_number,
        transaction_id: transaction.transaction_id,
        reference: transaction.reference
      });
    } else {
      res.status(404).json({ message: 'Teservation not found' });
    }
  } catch (error) {
    console.error('Error fetching reservation parameters:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/bus-details/:bus_number', verifyToken, async (req, res) => {

  const { bus_number } = req.params;

  try {

    console.log('Bus Number:', bus_number);

    const recentTransactionSubquery = db('transactions')
      .select('bus_number', 'reference')
      .where('bus_number', bus_number)
      .orderBy('transaction_date', 'desc') 
      .first()
      .as('latest_transaction');

    const busDetails = await db('buses')
      .join('routes', 'buses.bus_id', '=', 'routes.bus_id')
      .join('users', 'buses.driver_id', '=', 'users.user_id')
      .leftJoin(recentTransactionSubquery, 'buses.bus_number', 'latest_transaction.bus_number')
      .select(
        'buses.bus_id',
        'buses.bus_number',
        'buses.seat_capacity as seat_capacity',
        'users.username as driver_name',
        'routes.route_name',
        'routes.fare_amount',
        'routes.departure_time',
        'latest_transaction.reference'
      )
      .where('buses.bus_number', bus_number)
      .first();

    console.log('Bus Details:', busDetails);

    if (!busDetails) {
      return res.status(404).json({ msg: 'Bus details not found' });
    }

    res.status(200).json(busDetails);
  } catch (err) {
    console.error('Error fetching bus details:', err.message);
    res.status(500).send('Server error');
  }
});

app.post('/confirm-reservation', verifyToken, async (req, res) => {

  const { amount, route_name, bus_number, seat_number, departure_time, reference } = req.body;
  
  const user_id = req.userId;

  try {

    console.log('Bus number:', bus_number);
const bus = await db('buses').where('bus_number', bus_number).first();
console.log('Bus:', bus);

    if (!bus) {
      return res.status(404).json({ message: 'Bus not found!' });
    }

    const transaction = await db('transactions')
      .where('user_id', user_id)
      .first();

    if (!transaction) {
      return res.status(400).json({ message: 'Transaction not found!' });
    }

    const roles = await db('roles')
      .whereNotNull('role_id')
      .first();

    if (!roles) {
      return res.status(400).json({ message: 'Role not found!' });
    }

    const [reservation] = await db('reservations')
      .insert({
        user_id,
        route_name,
        bus_number,
        seat_number,
        status: 'booked',
        transaction_id: transaction.transaction_id,
        amount,
        reservation_date: new Date(),
        departure_time,
        role_id: roles.role_id,
        reference
      })
      .returning('reservation_id');

    await db('seats')
      .where({ bus_id: bus.bus_id, seat_number })
      .update({ status: 'booked', user_id });

    res.status(200).json({ message: 'Seat booked successfully', reservation });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/receipt/:reservation_id', async (req, res) => {
  
  const { reservation_id } = req.params;

  if (!reservation_id) {
    return res.status(400).json({ msg: 'Reservation ID is required' });
  }

  console.log(`Received reservation_id: ${reservation_id}`);

  try {
    
    const reservation = await db('reservations').where('reservation_id', reservation_id).first();
    if (!reservation) {
      return res.status(404).json({ msg: 'Receipt not found' });
    }

    const receipt = await db('reservations')
      .join('users', 'reservations.user_id', '=', 'users.user_id')
      .join('buses', 'reservations.bus_number', '=', 'buses.bus_number')
      .join('routes', 'reservations.route_name', '=', 'routes.route_name')
      .join('seats', 'reservations.seat_number', '=', 'seats.seat_number')
      .join('roles', 'reservations.role_id', '=', 'roles.role_id') 
      .join('transactions', 'reservations.reference', '=', 'transactions.reference')

      .select(
        'users.name',
        'routes.route_name',
        'buses.bus_number',
        'reservations.amount',
        'reservations.reservation_date',
        'reservations.departure_time',
        'reservations.seat_number',
        'transactions.reference',
        'reservations.reservation_id',
        'roles.role_name'
      )
      .where('reservations.reservation_id', reservation_id)
      .first();

    if (!receipt) {
      return res.status(404).json({ msg: 'Receipt not found' });
    }

    res.status(200).json({
      receipt
    });
  } catch (err) {
    console.error('Error fetching receipt:', err.message);
    res.status(500).json('Server error'); 
  }
});

app.get('/booking-history/:user_id', async (req, res) => {

  const { user_id } = req.params;
  const currentTime = new Date();

  try {
    const bookings = await db('reservations')
      .join('buses', 'reservations.bus_id', '=', 'buses.bus_id')
      .join('routes', 'reservations.route_id', '=', 'routes.route_id')
      .select(
        'reservations.reservation_id', 
        'buses.bus_number', 
        'routes.route_name', 
        'reservations.departure_time', 
        'reservations.amount', 
        'reservations.status', 
        'reservations.reservation_date'
      )
      .where('reservations.user_id', user_id);

    const upcomingBookings = bookings.filter(booking => new Date(booking.departure_time) > currentTime);
    const previousBookings = bookings.filter(booking => new Date(booking.departure_time) <= currentTime);

    res.status(200).json({ upcomingBookings, previousBookings });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/cancel-booking', async (req, res) => {

  const { reservation_id } = req.body;

  try {
    const reservation = await db('reservations')
      .where({ reservation_id, status: 'active' })
      .first();

    if (!reservation) {
      return res.status(400).json({ message: 'Reservation not found or already canceled' });
    }

    const refundAmount = reservation.amount / 2;

    await db.transaction(async (trx) => {
      await trx('reservations').where({ reservation_id }).update({ status: 'canceled' });
      await trx('users').where({ user_id: reservation.user_id }).increment('balance', refundAmount);
    });

    res.status(200).json({ message: 'Booking canceled and half fare refunded' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/update-notification-settings', async (req, res) => {

  const { user_id, notifications_enabled } = req.body;

  try {
    await db('users').where({ user_id }).update({ notifications_enabled });

    res.status(200).json({ message: 'Notification settings updated' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});
  

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`)
});
  

