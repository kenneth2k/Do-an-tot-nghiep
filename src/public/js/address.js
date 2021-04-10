$(document).ready(function () {
    const city = document.getElementById('select-city');
    const district = document.getElementById('select-district');
    const ward = document.getElementById('select-ward');
    getCity();
    function getCity(){
        $.ajax({
            type: "GET",
            url: '/api/city',
            success: function(data)
            {
                if(data.message === true){
                    
                    var label = `<label class="input-label">Tỉnh/Thành phố</label>`;
                    var startSelect = `<select required="" name="chooseCity"><option value="">Chọn Tỉnh/Thành phố</option>`;
                    var endSelect = `</select>`;
                    data.city.forEach(value =>{
                        startSelect += `<option value="${value.province_id}">${value.province_name}</option>`;
                    })
                    if(city){
                        city.innerHTML = label + startSelect + endSelect;
                    
                        var select = $(city.querySelector('select'));
                        select.change(function(){
                            getDistrict($(this).val());
                        })
                    }
                }
            },
            error: function(err){
                console.log(err);
            }
        });
    }
    function getDistrict(city){
        
        $.ajax({
            type: "GET",
            url: '/api/city/'+city+'/district',
            success: function(data)
            {
                if(data.message === true){

                    var label = `<label class="input-label">Quận huyện</label>`;
                    var startSelect = `<select required="" name="chooseCity"><option value="">Chọn Quận/Huyện</option>`;
                    var endSelect = `</select>`;
                    data.city.forEach(value =>{
                        startSelect += `<option value="${value.district_id}">${value.district_name}</option>`;
                    })
                    district.innerHTML = "";
                    district.innerHTML = label + startSelect + endSelect;
                    var select = $(district.querySelector('select'));
                    getWard(null);
                    select.change(function(){
                        getWard($(this).val());
                    })
                }
            },
            error: function(err){
                console.log(err);
            }
        });
    }
    function getWard(district){
        if(district == null){
            var label = `<label class="input-label">Phường xã</label>`;
            var startSelect = `<select disabled="disabled" required="" name="chooseCity"><option value="">Chọn Phường/Xã</option>`;
            var endSelect = `</select>`;
            ward.innerHTML = "";
            ward.innerHTML = label + startSelect + endSelect;
            return;
        }
        $.ajax({
            type: "GET",
            url: '/api/district/'+district+'/ward',
            success: function(data)
            {
                if(data.message === true){
                    
                    var label = `<label class="input-label">Phường xã</label>`;
                    var startSelect = `<select required="" name="chooseCity"><option value="">Chọn Phường/Xã</option>`;
                    var endSelect = `</select>`;
                    data.city.forEach(value =>{
                        startSelect += `<option value="${value.ward_id}">${value.ward_name}</option>`;
                    })
                    ward.innerHTML = "";
                    ward.innerHTML = label + startSelect + endSelect;
                }
            },
            error: function(err){
                console.log(err);
            }
        });
    }
});