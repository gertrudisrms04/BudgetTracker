document.addEventListener("DOMContentLoaded", function () {
    const saldoElement = document.getElementById("Saldo");
    const transactionForm = document.getElementById("transaction-form");
    const deskripsiSelect = document.getElementById("deskripsi");
    const customDeskripsiInput = document.getElementById("custom-Deskripsi");
    const categoryInput = document.getElementById("category");
    const amountInput = document.getElementById("amount");
    const tabelTransaksi = document.getElementById("tabel-transaksi");

    let transaksi = JSON.parse(localStorage.getItem("transaksi")) || [];

    // Data deskripsi untuk masing-masing kategori
    const deskripsiData = {
        Pendapatan: ["Gaji", "Bonus", "Hasil Investasi", "Pemasukan Lainnya"],
        Pengeluaran: ["Makan", "Belanja", "Tagihan", "Pengeluaran Lainnya"]
    };

    function updateDeskripsiOptions() {
        const kategori = categoryInput.value;
        deskripsiSelect.innerHTML = `<option value="" disabled selected>Pilih Deskripsi</option>`;

        if (deskripsiData[kategori]) {
            deskripsiData[kategori].forEach(desc => {
                const option = document.createElement("option");
                option.value = desc;
                option.textContent = desc;
                deskripsiSelect.appendChild(option);
            });
        }
    }

    categoryInput.addEventListener("change", updateDeskripsiOptions);

    function updateUI() {
        tabelTransaksi.innerHTML = "";
        let totalSaldo = 0;

        transaksi.forEach((item, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${item.deskripsi}</td>
                <td>${item.kategori}</td>
                <td>Rp ${item.jumlah.toLocaleString("id-ID")}</td>
                <td><button class="delete-btn" onclick="hapusTransaksi(${index})">X</button></td>
            `;

            tabelTransaksi.appendChild(row);
            totalSaldo += item.kategori === "Pendapatan" ? item.jumlah : -item.jumlah;
        });

        saldoElement.textContent = `Rp ${totalSaldo.toLocaleString("id-ID")}`;
        localStorage.setItem("transaksi", JSON.stringify(transaksi));
    }

    transactionForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const deskripsi = deskripsiSelect.value;
        const jumlah = parseFloat(amountInput.value);
        const kategori = categoryInput.value;

        if (!kategori || !deskripsi || isNaN(jumlah) || jumlah <= 0) {
            alert("Harap isi kategori, deskripsi, dan jumlah dengan benar!");
            return;
        }

        transaksi.push({ deskripsi, jumlah, kategori });
        amountInput.value = "";
        categoryInput.value = "";
        deskripsiSelect.innerHTML = `<option value="" disabled selected>Pilih Deskripsi</option>`;

        updateUI();
    });

    window.hapusTransaksi = function (index) {
        transaksi.splice(index, 1);
        updateUI();
    };

    updateUI();
});
