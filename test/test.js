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

  describe('basic read/write', function(){
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

      var supermodel = supermodels(data, 'address.postcode', 'primitive');

      supermodel().should.equal('SW12');

      supermodel('apples');

      supermodel().should.equal('apples');
      data.address.postcode.should.equal('apples');
    })
  })

  describe('array values', function(){
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

      var supermodel = supermodels(data, 'address.postcode', 'primitive');

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

  describe('remove', function(){
    it('should return a remove function', function(){

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
        removeAddress:supermodels(function(){
          return this.models;
        }, 'address', 'remove')
      }

      obj.removeAddress('postcode');

      ('-' + obj.models[0].address.postcode).should.equal('-undefined');

    })
  })

  describe('array value', function(){

    function get_obj(){

      var obj = {
        models:[{
          address:{
            postcode:'SW12',
            tags:['a', 'b', 'c']
          }
        },{
          address:{
            postcode:'BS2',
            tags:['a']
          }
        }],
        addTag:supermodels(function(){
          return this.models;
        }, 'address.tags', 'array:add'),
        removeTag:supermodels(function(){
          return this.models;
        }, 'address.tags', 'array:remove'),
        hasTag:supermodels(function(){
          return this.models;
        }, 'address.tags', 'array:has')
      }

      return obj;
    }

    it('should add an array value', function(){

      var obj = get_obj();

      obj.addTag('b');

      obj.models[0].address.tags.length.should.equal(3);
      obj.models[1].address.tags[1].should.equal('b');

    })


    it('should remove an array value', function(){

      var obj = get_obj();

      obj.removeTag('a');

      obj.models[0].address.tags.length.should.equal(2);
      obj.models[1].address.tags.length.should.equal(0);
      obj.models[0].address.tags[0].should.equal('b');

    })

    it('should check if it has an array value', function(){

      var obj = get_obj();

      obj.hasTag('a').should.equal(true);
      obj.hasTag('d').should.equal(false);

    })
  })

  
  describe('types', function(){


    it('should do a has filter', function(){

      var data = {
        address:{
          postcode:{
            hello:20
          }
        }
      };

      var supermodelhas = supermodels(data, 'address.postcode', 'has');

      supermodelhas().should.equal(true);
      supermodelhas('hello').should.equal(true);
      supermodelhas('dfdfdf').should.equal(false);
    })

    it('should do a is filter', function(){

      var data = {
        address:{
          postcode:'SW12'
        }
      };

      var supermodelis = supermodels(data, 'address.postcode', 'is');

      supermodelis().should.equal(false);
      supermodelis('DFDF').should.equal(false);
      supermodelis('SW12').should.equal(true);

    })
  })

	
})


