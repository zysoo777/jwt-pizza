import { sleep, group, check } from 'k6';
import http from 'k6/http';

export const options = {
  cloud: {
    distribution: {
      'amazon:us:ashburn': {
        loadZone: 'amazon:us:ashburn',
        percent: 100,
      },
    },
    apm: [],
  },
  thresholds: {},
  scenarios: {
    Scenario_1: {
      executor: 'ramping-vus',
      gracefulStop: '30s',
      stages: [
        { target: 20, duration: '1m' },
        { target: 20, duration: '3m30s' },
        { target: 0, duration: '1m' },
      ],
      gracefulRampDown: '30s',
      exec: 'scenario_1',
    },
  },
};

export function scenario_1() {
  const vars = {};

  group('page_1 - https://pizza.cs329-jwt-pizza.click/', function () {
    // Login
    const loginRes = http.put(
      'https://pizza-service.cs329-jwt-pizza.click/api/auth',
      JSON.stringify({
        email: 'a@jwt.com',
        password: 'admin',
      }),
      {
        headers: {
          accept: '*/*',
          'content-type': 'application/json',
          origin: 'https://pizza.cs329-jwt-pizza.click',
        },
      }
    );

    check(loginRes, {
      'login status is 200': (r) => r.status === 200,
      'login returned token': (r) => !!r.json('token'),
    });

    vars.token = loginRes.json('token');

    sleep(2);

    // Get menu
    http.get('https://pizza-service.cs329-jwt-pizza.click/api/order/menu', {
      headers: {
        accept: '*/*',
        'content-type': 'application/json',
        origin: 'https://pizza.cs329-jwt-pizza.click',
      },
    });

    sleep(1.3);

    // Get franchise
    http.get(
      'https://pizza-service.cs329-jwt-pizza.click/api/franchise?page=0&limit=20&name=*',
      {
        headers: {
          accept: '*/*',
          'content-type': 'application/json',
          origin: 'https://pizza.cs329-jwt-pizza.click',
        },
      }
    );

    sleep(2);

    // Get current user
    http.get('https://pizza-service.cs329-jwt-pizza.click/api/user/me', {
      headers: {
        accept: '*/*',
        'content-type': 'application/json',
        origin: 'https://pizza.cs329-jwt-pizza.click',
        Authorization: `Bearer ${vars.token}`,
      },
    });

    sleep(1);

    // Purchase pizza
    const orderRes = http.post(
      'https://pizza-service.cs329-jwt-pizza.click/api/order',
      JSON.stringify({
        items: [
          {
            menuId: 1,
            description: 'Pepperoni',
            price: 12.5,
          },
        ],
        storeId: '1',
        franchiseId: 45,
      }),
      {
        headers: {
          accept: '*/*',
          'content-type': 'application/json',
          origin: 'https://pizza.cs329-jwt-pizza.click',
          Authorization: `Bearer ${vars.token}`,
        },
      }
    );

    check(orderRes, {
      'purchase status is 200': (r) => r.status === 200,
      'purchase returned jwt': (r) => !!r.json('jwt'),
    });

    vars.pizzaJwt = orderRes.json('jwt');

    sleep(2);

    // Verify pizza
    const verifyRes = http.post(
      'https://pizza-factory.cs329.click/api/order/verify',
      JSON.stringify({
        jwt: vars.pizzaJwt,
      }),
      {
        headers: {
          accept: '*/*',
          'content-type': 'application/json',
          origin: 'https://pizza.cs329-jwt-pizza.click',
        },
      }
    );

    check(verifyRes, {
      'verify status is 200': (r) => r.status === 200,
    });
  });
}