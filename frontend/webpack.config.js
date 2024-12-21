module.exports = {
    module: {
      rules: [
        {
          test: /\.jsx?$/,  // Matches .js and .jsx files
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
        },
      ],
    },
  };
  