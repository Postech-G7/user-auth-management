const validateSyncErrors = [
  {
    target: {
      name: 'Jo',
      email: 'invalid-email',
      age: 16,
    },
    value: 'Jo',
    property: 'name',
    children: [],
    constraints: {
      minLength: 'name must be longer than or equal to 3 characters',
    },
  },
  {
    target: {
      name: 'Jo',
      email: 'invalid-email',
      age: 16,
    },
    value: 'invalid-email',
    property: 'email',
    children: [],
    constraints: {
      isEmail: 'email must be an email',
    },
  },
  {
    target: {
      name: 'Jo',
      email: 'invalid-email',
      age: 16,
    },
    value: 16,
    property: 'age',
    children: [],
    constraints: {
      min: 'age must not be less than 18',
    },
  },
];
