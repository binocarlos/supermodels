var supermodels = require('../src/index');

describe('supermodels', function(){

  describe('constructor', function(){
  
    it('should be a function', function(){
      supermodels.should.be.type('function');
    })

    it('should return a function', function(){

      var supermodel = supermodels({});
      supermodels.should.be.type('function');
      
    })


  })

  describe('supermodel', function(){
    it('should read a value', function(){

      var data = {
        address:{
          postcode:'SW12'
        }
      };

      var supermodel = supermodels(data);

      supermodel('address.postcode').should.equal('SW12');
    })

    it('should write a value', function(){

      var data = {};

      var supermodel = supermodels(data);

      supermodel('address.postcode.test.a', 10);

      data.address.postcode.test.a.should.equal(10);
    })

    it('should write an object value', function(){

      var data = {
        address:{
          postcode:'SW12'
        }
      };

      var supermodel = supermodels(data);

      supermodel('address.postcode', {
        test:10
      });

      data.address.postcode.test.should.equal(10);
    })

    it('should write a sub-level value', function(){

      var data = {
        address:{
          postcode:'SW12'
        }
      };

      var supermodel = supermodels(data, 'address');

      supermodel('postcode', {
        test:10
      });

      data.address.postcode.test.should.equal(10);
    })

    it('should write a sub-level sub value', function(){

      var data = {
        address:{
          postcode:{
            hello:20
          }
        }
      };

      var supermodel = supermodels(data, 'address');

      supermodel('postcode.apples', 10);

      data.address.postcode.apples.should.equal(10);
    })

    it('should write a property value', function(){

      var data = {
        address:{
          postcode:'SW12'
        }
      };

      var supermodel = supermodels(data, 'address.postcode', true);

      supermodel().should.equal('SW12');

      supermodel('apples');

      supermodel().should.equal('apples');
      data.address.postcode.should.equal('apples');
    })


    it('should read/write an array value', function(){

      var data = [{
        address:{
          postcode:'SW12'
        }
      },{
        address:{
          postcode:'BS2'
        }
      }];

      var supermodel = supermodels(data, 'address.postcode', true);

      supermodel().should.equal('SW12');

      supermodel('apples');

      supermodel().should.equal('apples');
      data[0].address.postcode.should.equal('apples');
      data[1].address.postcode.should.equal('apples');
    })


    it('should read/write an array value from a function context', function(){

      var obj = {
        models:[{
          address:{
            postcode:'SW12'
          }
        },{
          address:{
            postcode:'BS2'
          }
        }],
        address:supermodels(function(){
          return this.models;
        }, 'address')
      }


      obj.address().postcode.should.equal('SW12');

      obj.address({
        postcode:'apples',
        test:10
      })

      obj.address().postcode.should.equal('apples');
      obj.address().test.should.equal(10);

      obj.address('postcode').should.equal('apples');


      obj.models[0].address.postcode.should.equal('apples');
      obj.models[1].address.postcode.should.equal('apples');
      obj.models[1].address.test.should.equal(10);
      
    })
  })

	
})


