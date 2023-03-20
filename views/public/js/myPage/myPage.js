
let user;

$(document).ready(
  function() {
    showMyPage(),
    showMyCat()
  }
)

function showMyPage() {
  $.ajax({
    type: 'GET',
    url: 'users/mypage',
    data: {},
    success: function (response) {
      user = response;
      let addressCertified = response.address_certified == 1 ? '인증됨' : '인증 안됨';

      let tempHtml = `      
      <div class="lineContainer">
        <ul class="line">
          <div class="subLine">
            <li class="miniTitle">이메일</li>
            <input value="${response.email}" class="infoContent" type="text" readonly>
          </div>
          <div class="subLine">
            <li class="miniTitle">이름</li>
            <input value="${response.name}" class="infoContent1" type="text" readonly>
          </div>
          <div class="subLine">
            <li class="miniTitle">주소</li>
            <input value="${response.address_road}" class="infoContent1" type="text" id="address_road" placeholder="주소" readonly>
            <input value="${response.address_bname}" class="infoContent1" type="text" id="address_bname" placeholder="동" readonly>
            <input type="button" onclick="findAddress()" class="btn btn-outline-secondary" value="주소 검색"><br>
          </div>
          <div class="">
            <li class="miniTitle">동네 인증 상태</li>
            <input value="${addressCertified}" class="infoContent1" type="text" id="address_certified" placeholder"위치 인증 여부" readonly>
            <button onclick="verifyLocation()" type="button" class="btn btn-outline-success">내 위치로 동네 인증하기</button>
          </div>
        </ul> 
        <ul class="line" id="line3">
          <div class="subLine">
            <li class="miniTitle">닉네임</li>
            <input value="${response.nickname}" class="infoContent1" id="nickname" type="text">
          </div>
          <div class="subLine">
            <li class="miniTitle">전화번호</li>
            <input value="${response.phone_number}" class="infoContent" id="phoneNumber" type="text">
          </div>
        </ul> 
    </div>
    
    <div class="edit">
      <button class="editBtn" onclick= "modifyMyPage(${response.user_id})">수정</button>
      <button class="removeBtn" onclick= "deleteUser(${response.user_id})">회원 탈퇴</button>
    </div>`
    $('.humanInfo').append(tempHtml)
    }
  })
}

function modifyMyPage(id) {
  const nickname = $('#nickname').val();
  const address_road = $('#address_road').val();
  const address_bname = $('#address_bname').val();
  const phone_number = $('#phoneNumber').val();
  let address_certified = $('#address_certified').val() == '인증됨';
  console.log('현재 인증 상태: ', address_certified)

  // 주소를 변경하겠다는 상태라면
  if (user.address_road !== address_road) {
    const yesChangeAddress = confirm('주소 변경시 동네 인증을 다시 해야 합니다. 주소를 변경하시겠습니까? ')
    if (yesChangeAddress) {
      address_certified = false;
    } else {
      return;
    }
  }
  
  $.ajax({
    type: 'PATCH',
    url: `users/mypage/${id}`,
    dataType: 'json',
    contentType: 'application/json; charset=utf-8',
    async: false,
    data: JSON.stringify({
      nickname,
      address_road,
      address_bname,
      address_certified,
      phone_number,
    }),
    success: function (response) {
      alert('회원 정보 수정이 완료되었습니다')
      window.location.reload()
    },
    error: function(response) {
      console.log(response)
    }
  })
}

function deleteUser(id) {
  $.ajax({
    type: 'DELETE',
    url: `users/mypage/${id}`,
    success: function(response) {
      window.location.replace('/')
    }
  })
}

// 고양이 정보 불러오기

function showMyCat() {
  $.ajax({
    type: 'GET',
    url: '/cats',
    data: {},
    success: function(response) {
      let rows = response
      for (let i = 0; i < rows.length; i++) {
        let catName = rows[i]['name'];
        let catAge = rows[i]['age'];
        let catGender = rows[i]['gender'];
        let catNeutered = rows[i]['neutered'];
// FIXME: 이미지 업로드 완성되면 수정 let catImg = rows[i]['image'];
        let catCharacter = rows[i]['character'];
        let catId = rows[i]['cat_id'];

        let neutered = '';
        let neutered2 = '';
        let neutered3 = true;
        let neutered4 = false;

        if (catNeutered === true) {
          neutered = '유'
          neutered2 = '무'
        }
        if (catNeutered === false) {
          neutered = '무'
          neutered2 = '유'
          neutered3 = false
          neutered4 = true
        }
        let tempHtml = `      
      <div class="lineContainer2">
        <li class="catPageCard">
          <div class="imgContainer3">
            <img src="" alt="">
          </div>
          <label for="catFile">
            <div class="uploaderBtn">사진 선택</div>
          </label>
          <input class="uploader" type="file" id="catFile">
          <div class="infoContainer2">
            <div class="nameContainer2">
              <div class="catInfo2" id="name2">
                이름
              </div>
              <div class="catName2">
                ${catName}
              </div>
            </div>
            <div class="ageContainer2">
              <div class="catInfo2" id="age2">
                나이
              </div>
              <div class="catAge2">
                <input value="${catAge}" class="catContent" id="catAge2">                
              </div>
            </div>
          </div>
          <div class="infoContainer2">
            <div class="nameContainer2">
              <div class="catInfo2" id="name2">
                성별
              </div>
              <div class="genderSelect">
                <div class="genderSelect2">
                  ${catGender}
                </div>
              </div>
            </div>
            <div class="ageContainer3">
              <div class="catInfo3">
                중성화 여부
              </div>
              <div class="neuteredSelect">
                <select class="neuteredSelect2" id="catNeutered" name="neutered">
                  <option value="${neutered3}">${neutered}</option>
                  <option value="${neutered4}">${neutered2}</option>
                </select>
              </div>
            </div>
          </div>
          <div class="characterContainer2">
            <div class="catInfo2" id="character2">
              성격
            </div>
            <div class="catCharacter2">
              <input value="${catCharacter}" class="catContent" id="catCharacter2">              
            </div>
            <div class="edit2">
              <button onclick="modifyMyCat(${catId})" class="editBtn2">수정</button>
              <button onclick="deleteMyCat(${catId})" class="cancleBtn2">삭제</button>
            </div>
          </div>
        </li>
      </div>`
      $('.catInfo1').append(tempHtml)
      }
      
    }
  })
}

function modifyMyCat(id) {

  // const catImg = $('#catFile').val();
  const catAge = $('#catAge2').val();
  let catNeutered = $('#catNeutered').val();
  const catCharacter = $('#catCharacter2').val();
  
  if (catNeutered === 'true') {
    catNeutered = true
  }
  if (catNeutered === 'false') {
    catNeutered = false
  }
  console.log(catAge)
  console.log(typeof(catNeutered))
  console.log(catCharacter)
  $.ajax({
    type: 'PATCH',
    url: `/cats/${id}`,
    dataType: 'json',
    contentType: 'application/json; charset=utf-8',
    async: false,
    data: JSON.stringify({
      image: '1',
      age: Number(catAge),
      neutered: catNeutered,
      character: catCharacter
    }),
    success: function(response) {
      window.location.reload()
    }
  })  
}

function deleteMyCat(id) {
  $.ajax({
    type: 'DELETE',
    url: `/cats/${id}`,
    success: function(response) {
      window.location.reload()
    }
  })
}


// '주소 검색' 버튼 클릭시 다음 우편번호 찾기 api로 주소 검색
function findAddress() {
  new daum.Postcode({
      oncomplete: function(data) {
          var address_road = data.address; // 최종 도로명 주소
          var address_bname = data.bname? data.bname : ''; // 동 (지번주소)

          // 주소 정보를 해당 필드에 넣는다.
          document.getElementById("address_road").value = address_road;
          document.getElementById("address_bname").value = address_bname;
      }
  }).open();
}

// '내 위치로 동네 인증' 버튼 클릭시 사용자의 현재 위치를 얻어와 주소지와 비교,
// 동네명이 같거나 기록된 주소<->현재위치 거리가 1km 이내라면 동네 인증 처리
async function verifyLocation() {

  //주소-좌표 변환 객체를 생성
  var geocoder = new daum.maps.services.Geocoder();

  // 유저의 도로명 주소와 동네명을 불러온다 -> DB에서 직접 불러오는 것으로 변경
  let userAddress = user.address_road
  let userAddressBname = user.address_bname;  
  
  // 새 주소찾기를 하였지만 아직 수정 버튼을 눌러 DB를 업데이트하지 않은 상황이면
  if (user.address_road != document.getElementById('address_road').value) { 
    alert('수정 버튼을 눌러 정보 업데이트 후 진행해주세요');
    return;
  }

  // geolocation.getCurrentPosition 성공시 콜백
  function success(position) {
    
    // 유저의 현재 GPS 위치를 불러온다
    const { latitude, longitude } = position.coords;
    
    // kakao map api를 이용하여 두 좌표 사이의 거리 측정하기
    geocoder.addressSearch(userAddress, function(results, status) {
      if (status === daum.maps.services.Status.OK) {
        let result = results[0];

        // 주소로 검색해 kakao map 좌표 객체를 얻고
        var userAddressCoords = new daum.maps.LatLng(result.y, result.x);
        // 현재 좌표로 kakao map 좌표 객체를 얻어서
        var userCurrentCoords = new daum.maps.LatLng(latitude, longitude);

        // 두 좌표를 경로로 하는 폴리라인 설정
        var line = new kakao.maps.Polyline();
        var path = [ userAddressCoords, userCurrentCoords ];
        line.setPath(path);

        console.log('두 좌표 사이의 거리: ', line.getLength())
        
        const isInRadius = line.getLength() <= 1000
        alert(`위치 인증을 마쳤습니다. 결과는 ${isInRadius}입니다`)


        // kakao map api를 이용하여 두 좌표의 동네명 비교하기
        geocoder.coord2Address(longitude, latitude, function (results, status) {
          if (status === daum.maps.services.Status.OK) {
            let result = results[0];
            console.log("현재 좌표 기반 주소찾기 결과: ", result);
    
            // 현재 좌표로 동네명 얻기
            var userCurrentBname = result.address.region_3depth_name;
            console.log('현재 동네명: ', userCurrentBname)
    
            const isSameBname = userCurrentBname == userAddressBname
            alert(`동네 인증을 마쳤습니다. ${isSameBname}입니다`)


            // 동네명이 같거나 기록된 주소<->현재위치 거리가 1km 이내라면 
            // 사용자의 address_certified 컬럼을 true로 변환시키는 ajax 콜 호출
              console.log('isSameBname, isInRadius: ', isSameBname, isInRadius)
              if (isSameBname || isInRadius) {
                alert('사용자 정보를 변경합니다');
                $.ajax({
                  type: 'PATCH',
                  url: `users/address/certify`,
                  contentType: 'application/json; charset=utf-8',
                  data: JSON.stringify({
                    address_certified: true,
                  }),
                  success: function (response) {
                    alert('회원 정보 수정이 완료되었습니다')
                    window.location.reload()
                  },
                  error: function(response) {
                    console.log(response)
                  }
                })
              }

          } else {
            console.log('geocoder.coord2Address 도중 문제가 생겼습니다. 상태코드: ', status);
            return;
          }
        })

      } else {
        console.log('geocoder.addressSearch 도중 문제가 생겼습니다. 상태코드: ', status);
        return;
      }
    })
    
  }

  // geolocation.getCurrentPosition 실패시 콜백
  function error() {
    alert('위치 정보를 불러올 수 없습니다.');
  }

  // 실행 가능한 환경이라면 geolocation으로 사용자의 현재 좌표 정보에 접근 
  if(!navigator.geolocation) {
    alert('현재 브라우저로는 위치 서비스를 이용하실 수 없습니다. 다른 브라우저로 접속하거나 운영자에게 문의해주세요.');
  } else {
    alert('위치 정보를 성공적으로 불러옵니다')
    return navigator.geolocation.getCurrentPosition(success, error);
  }
}

