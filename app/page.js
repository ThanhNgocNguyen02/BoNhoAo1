// src/App.js
'use client';
import React, { useState } from 'react';
import './globals.css';

const App = () => {
  const [algorithm, setAlgorithm] = useState('fifo');
  const [frameCount, setFrameCount] = useState(3);
  const [pages, setPages] = useState('');
  const [result, setResult] = useState('');

  // Định nghĩa lý thuyết cho từng thuật toán
  const theories = {
    fifo: (
      <>
        <h3>FIFO (First-In, First-Out)</h3>
        <p><strong>Khái niệm:</strong> FIFO là một thuật toán đơn giản nhất trong quản lý bộ nhớ. Nó duy trì một hàng đợi cho các trang đã được nạp vào bộ nhớ. Khi cần thay thế một trang, thuật toán sẽ loại bỏ trang đã được nạp vào bộ nhớ lâu nhất.</p>
        <p><strong>Cách hoạt động:</strong> Khi một trang mới được yêu cầu nhưng bộ nhớ đã đầy, thuật toán sẽ loại bỏ trang ở đầu hàng đợi (trang cũ nhất) và thêm trang mới vào cuối hàng đợi.</p>
        <p><strong>Ưu điểm:</strong> Dễ hiểu và dễ triển khai. Không yêu cầu theo dõi thời gian truy cập của các trang.</p>
        <p><strong>Nhược điểm:</strong> Không phải lúc nào cũng hiệu quả, có thể dẫn đến lỗi trang nhiều nếu trang cũ vẫn còn được sử dụng thường xuyên.</p>
      </>
    ),
    lru: (
      <>
        <h3>LRU (Least Recently Used)</h3>
        <p><strong>Khái niệm:</strong> LRU là thuật toán quản lý bộ nhớ dựa trên nguyên tắc rằng trang nào không được sử dụng trong thời gian dài nhất sẽ là trang cần được thay thế. Nó theo dõi thời gian sử dụng của các trang trong bộ nhớ.</p>
        <p><strong>Cách hoạt động:</strong> Mỗi khi một trang được truy cập, thuật toán sẽ cập nhật thời gian sử dụng của trang đó. Khi cần thay thế, LRU sẽ chọn trang có thời gian sử dụng lâu nhất (ít được sử dụng gần đây nhất).</p>
        <p><strong>Ưu điểm:</strong> Thường hiệu quả hơn FIFO trong việc giảm lỗi trang, vì nó xem xét thói quen sử dụng của người dùng.</p>
        <p><strong>Nhược điểm:</strong> Cần thêm bộ nhớ để lưu trữ thông tin về thời gian sử dụng, có thể phức tạp hơn trong việc triển khai.</p>
      </>
    ),
    opt: (
      <>
        <h3>OPT (Optimal Page Replacement)</h3>
        <p><strong>Khái niệm:</strong> Thuật toán OPT là thuật toán lý tưởng, nó chọn trang sẽ không được sử dụng lâu nhất trong tương lai để thay thế. Mặc dù đây là một lý thuyết hoàn hảo, nhưng không thể thực hiện trong thực tế vì nó cần dự đoán tương lai.</p>
        <p><strong>Cách hoạt động:</strong> Khi một trang mới được yêu cầu và bộ nhớ đã đầy, thuật toán sẽ xem xét tất cả các trang trong bộ nhớ và chọn trang nào sẽ không được sử dụng lâu nhất.</p>
        <p><strong>Ưu điểm:</strong> Thường mang lại hiệu suất tốt nhất trong việc giảm lỗi trang, vì nó tối ưu hóa việc sử dụng bộ nhớ.</p>
        <p><strong>Nhược điểm:</strong> Không thể thực hiện trong thực tế do không thể dự đoán chính xác tương lai; thường chỉ được dùng để so sánh với các thuật toán khác.</p>
      </>
    ),
  };

  /*const fifo = (pages, frames) => {
    let memory = Array(frames).fill(null); // Khởi tạo bộ nhớ với các giá trị null.
    let pageFaults = 0; // Khởi tạo số lỗi trang.
    let fifoIndex = 0; // Đánh dấu vị trí của khung bộ nhớ tiếp theo cần thay thế.
    let steps = []; // Lưu trữ các bước thực hiện.

    // Duyệt qua từng trang trong danh sách.
    for (let i = 0; i < pages.length; i++) {
      const currentPage = pages[i]; // Trang hiện tại.

      // Kiểm tra xem trang hiện tại đã có trong bộ nhớ chưa.
      if (!memory.includes(currentPage)) {
        const replacedPage = memory[fifoIndex]; // Trang sẽ bị thay thế.

        // Thêm trang vào bộ nhớ và tăng số lỗi trang.
        memory[fifoIndex] = currentPage;
        pageFaults++;

        // Ghi lại bước thực hiện cho bước này.
        steps.push(
          `Bước ${i + 1}: Thêm ${currentPage}, thay ${replacedPage || 'null'} vào bộ nhớ, lỗi trang => [${memory.join(', ')}]`
        );

        // Cập nhật vị trí khung bộ nhớ tiếp theo, vòng quay lại nếu cần.
        fifoIndex = (fifoIndex + 1) % frames;
      } else {
        // Nếu trang đã có trong bộ nhớ, chỉ cần ghi nhận không thay đổi gì.
        steps.push(`Bước ${i + 1}: ${currentPage} đã có trong bộ nhớ => [${memory.join(', ')}]`);
      }
    }

    // Trả về các bước thực hiện và tổng số lỗi trang.
    return { steps, pageFaults };
  };*/
  const fifo = (pages, frames) => {
    let memory = [];
    let pageFaults = 0;
    let steps = [];
    let queue = []; // Dùng để theo dõi thứ tự nhập vào khung

    for (let i = 0; i < pages.length; i++) {
      const currentPage = pages[i];

      if (!memory.includes(currentPage)) { // Nếu trang chưa có trong khung
        if (memory.length < frames) { // Nếu còn chỗ trống trong khung
          memory.push(currentPage);
          queue.push(currentPage);
          steps.push(`Bước ${i + 1}: Thêm ${currentPage} vào bộ nhớ, lỗi trang => [${memory.join(', ')}]`);
        } else { // Nếu không còn chỗ trống
          const oldestPage = queue.shift(); // Lấy trang đầu tiên trong hàng đợi
          const replaceIndex = memory.indexOf(oldestPage); // Tìm vị trí trang đó trong bộ nhớ
          memory[replaceIndex] = currentPage; // Thay thế trang
          queue.push(currentPage); // Đưa trang mới vào hàng đợi
          steps.push(`Bước ${i + 1}: Thêm ${currentPage}, thay ${oldestPage} (FIFO), lỗi trang => [${memory.join(', ')}]`);
        }
        pageFaults++;
      } else { // Nếu trang đã có trong khung
        steps.push(`Bước ${i + 1}: ${currentPage} đã có trong khung => [${memory.join(', ')}]`);
      }
    }

    return { steps, pageFaults };
  };




  // Hàm OPT
  /* const opt = (pages, frames) => {
     let memory = []; // Bộ nhớ hiện tại
     let pageFaults = 0; // Đếm lỗi trang
     let steps = []; // Lưu các bước thực hiện
 
     // Duyệt qua từng trang trong danh sách các trang
     for (let i = 0; i < pages.length; i++) {
       const currentPage = pages[i];
 
       // Kiểm tra nếu trang hiện tại đã có trong bộ nhớ
       if (!memory.includes(currentPage)) {
         if (memory.length < frames) {
           // Nếu bộ nhớ chưa đầy, thêm trang mới vào
           memory.push(currentPage);
           steps.push(`Bước ${i + 1}: Thêm ${currentPage} vào bộ nhớ, lỗi trang => [${memory.join(', ')}]`);
         } else {
           // Nếu bộ nhớ đã đầy, chọn trang cần thay thế (sử dụng thuật toán OPT)
           let farthestUse = -1;
           let pageToReplace = -1;
 
           // Duyệt qua các trang trong bộ nhớ và tìm trang nào không được sử dụng lâu nhất trong tương lai
           for (let j = 0; j < memory.length; j++) {
             let nextUse = pages.slice(i + 1).indexOf(memory[j]);
 
             if (nextUse === -1) {
               // Nếu trang không còn xuất hiện trong tương lai, chọn thay thế trang này
               pageToReplace = j;
               break;
             } else if (nextUse > farthestUse) {
               // Nếu trang này xuất hiện sau các trang khác, chọn trang này để thay thế
               farthestUse = nextUse;
               pageToReplace = j;
             }
           }
 
           // Thay thế trang được chọn với trang mới
           const replacedPage = memory[pageToReplace];
           memory[pageToReplace] = currentPage;
 
           // Ghi lại bước thay thế
           steps.push(`Bước ${i + 1}: Thêm ${currentPage}, thay ${replacedPage} (không còn xuất hiện trong tương lai), lỗi trang => [${memory.join(', ')}]`);
         }
         pageFaults++; // Tăng số lỗi trang
       } else {
         // Nếu trang đã có trong bộ nhớ, không thay đổi gì
         steps.push(`Bước ${i + 1}: ${currentPage} đã có trong bộ nhớ => [${memory.join(', ')}]`);
       }
     }
 
     return { steps, pageFaults }; // Trả về các bước và tổng số lỗi trang
   };*/
  const opt = (pages, frames) => {
    let memory = []; // Bộ nhớ hiện tại
    let pageFaults = 0; // Đếm lỗi trang
    let steps = []; // Lưu các bước thực hiện

    // Duyệt qua từng trang trong danh sách các trang
    for (let i = 0; i < pages.length; i++) {
      const currentPage = pages[i];

      // Kiểm tra nếu trang hiện tại đã có trong bộ nhớ
      if (!memory.includes(currentPage)) {
        if (memory.length < frames) {
          // Nếu bộ nhớ chưa đầy, thêm trang mới vào
          memory.push(currentPage);
          steps.push(`Bước ${i + 1}: Thêm ${currentPage} vào bộ nhớ, lỗi trang => [${memory.join(', ')}]`);
        } else {
          // Nếu bộ nhớ đã đầy, chọn trang cần thay thế (sử dụng thuật toán OPT)
          let farthestUse = -1;
          let pageToReplace = -1;

          // Duyệt qua các trang trong bộ nhớ và tìm trang nào không được sử dụng lâu nhất trong tương lai
          for (let j = 0; j < memory.length; j++) {
            let nextUse = pages.slice(i + 1).indexOf(memory[j]);

            if (nextUse === -1) {
              // Nếu trang không còn xuất hiện trong tương lai, chọn thay thế trang này
              pageToReplace = j;
              break;
            } else if (nextUse > farthestUse) {
              // Nếu trang này xuất hiện sau các trang khác, chọn trang này để thay thế
              farthestUse = nextUse;
              pageToReplace = j;
            }
          }

          // Đảm bảo rằng `pageToReplace` đã được tìm thấy
          if (pageToReplace === -1) {
            throw new Error("Không thể tìm thấy trang để thay thế. Kiểm tra logic thuật toán!");
          }

          // Thay thế trang được chọn với trang mới
          const replacedPage = memory[pageToReplace];
          memory[pageToReplace] = currentPage;

          // Ghi lại bước thay thế
          steps.push(`Bước ${i + 1}: Thêm ${currentPage}, thay ${replacedPage}, lỗi trang => [${memory.join(', ')}]`);
        }
        pageFaults++; // Tăng số lỗi trang
      } else {
        // Nếu trang đã có trong bộ nhớ, không thay đổi gì
        steps.push(`Bước ${i + 1}: ${currentPage} đã có trong bộ nhớ => [${memory.join(', ')}]`);
      }
    }

    return { steps, pageFaults }; // Trả về các bước và tổng số lỗi trang
  };

  // Hàm LRU
  const lru = (pages, frames) => {
    let memory = [];
    let pageFaults = 0;
    let steps = [];
    let lastUsed = [];

    for (let i = 0; i < pages.length; i++) {
      const currentPage = pages[i];
      let pageIndex = memory.indexOf(currentPage);

      if (pageIndex === -1) {
        if (memory.length < frames) {
          memory.push(currentPage);
          lastUsed.push(i);
          steps.push(`Bước ${i + 1}: Thêm ${currentPage} vào bộ nhớ, lỗi trang => [${memory.join(', ')}]`);
        } else {
          let lruIndex = lastUsed.indexOf(Math.min(...lastUsed));
          const replacedPage = memory[lruIndex];
          memory[lruIndex] = currentPage;
          lastUsed[lruIndex] = i;
          steps.push(`Bước ${i + 1}: Thêm ${currentPage}, thay ${replacedPage} (ít sử dụng nhất), lỗi trang => [${memory.join(', ')}]`);
        }
        pageFaults++;
      } else {
        lastUsed[pageIndex] = i;
        steps.push(`Bước ${i + 1}: ${currentPage} đã có trong khung => [${memory.join(', ')}]`);
      }
    }

    return { steps, pageFaults };
  };

  // Xử lý chạy thuật toán
  const handleRun = () => {
    const pagesArray = pages.split(',').map(Number);
    let resultSteps, pageFaults;

    if (algorithm === 'fifo') {
      ({ steps: resultSteps, pageFaults } = fifo(pagesArray, frameCount));
    } else if (algorithm === 'opt') {
      ({ steps: resultSteps, pageFaults } = opt(pagesArray, frameCount));
    } else if (algorithm === 'lru') {
      ({ steps: resultSteps, pageFaults } = lru(pagesArray, frameCount));
    }

    let resultText = `Số Lỗi Trang: ${pageFaults}\n\nCác Bước Thực Thi:\n`;
    resultSteps.forEach(step => {
      resultText += `${step}\n`;
    });

    setResult(resultText);
  };

  return (
    <div className="container">
      <header>
        <h1>Quản Lý Bộ Nhớ Ảo</h1>
        <p>Minh họa các giải thuật FIFO, OPT và LRU</p>
      </header>

      <div className="controls">
        <label htmlFor="algorithm"><b>Chọn Giải Thuật:</b></label>
        <select id="algorithm" value={algorithm} onChange={e => setAlgorithm(e.target.value)}>
          <option value="fifo">FIFO (First In - First - Out)</option>
          <option value="opt">OPT (Optimal Page Replacement)</option>
          <option value="lru">LRU (Least Recently Used)</option>
        </select>

        <label htmlFor="frameCount"><b>Số Khung Bộ Nhớ:</b></label>
        <input
          type="number"
          id="frameCount"
          min="1"
          max="20"
          value={frameCount}
          onChange={e => setFrameCount(parseInt(e.target.value))}
        />

        <label htmlFor="pages"><b>Nhập Các Trang (cách nhau bằng dấu phẩy):</b></label>
        <input
          type="text"
          id="pages"
          placeholder="Ví dụ: 1, 2, 3, 4, 1, 3"
          value={pages}
          onChange={e => setPages(e.target.value)}
        />

        <button onClick={handleRun}>Chạy Mô Phỏng</button>
      </div>

      <div className="theory">
        <h2>Lý Thuyết:</h2>
        {theories[algorithm]}
      </div>

      <div className="output">
        <h2>Kết Quả Mô Phỏng:</h2>
        <pre id="result">{result}</pre>
      </div>
    </div>
  );
};

export default App;
