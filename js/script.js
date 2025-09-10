$(document).ready(function () {
    function renderLessonRow(count) {
        let currentCount = $('.lesson-row').length;


        if (count > currentCount) {
            for (let i = currentCount; i < count; i++) {
                let row = $(`
                <li class="lesson-row">
                    <div class="lesson-row-inner d-flex justify-content-center align-items-center gap-3">
                        <input type="number" min="1" max="100" id="fk-${i}" class="kredit-input form-control text-center" step="1" placeholder="kredit" required>
                        <input type="number" min="0" max="100" id="fb-${i}" class="bal-input form-control text-center" placeholder="bal" required>
                        <button type="button" class="row-delete-button btn btn-sm btn-danger">x</button>
                    </div>
                </li>
            `);
                $('#lesson-wrapper').append(row);
            }
        }


        else if (count < currentCount) {
            $('.lesson-row').slice(count).remove();
        }

        $('.kredit-input').on('input', function () {
            $(this).removeClass('is-invalid');
            let value = parseInt($(this).val());
            let min = parseInt($(this).attr('min'));
            let max = parseInt($(this).attr('max'));

            if (value < min) {
                value = min;
                $(this).val(min);
            }
            if (value > max) {
                value = max;
                $(this).val(max);
            }
        });

        $('.bal-input').on('input', function () {
            $(this).removeClass('is-invalid');
            let value = parseInt($(this).val());
            let min = parseInt($(this).attr('min'));
            let max = parseInt($(this).attr('max'));

            if (value < min) {
                value = min;
                $(this).val(min);
            }
            if (value > max) {
                value = max;
                $(this).val(max);
            }
        });
        $('.row-delete-button').click(function () {
            $(this).closest('.lesson-row').remove();
            let currentCount = $('.lesson-row').length;
            $('#add-lesson-input').val(currentCount);

            let max = parseInt($('#add-lesson-input').attr('max'));
            if (currentCount < max) {
                $('#add-lesson-button').attr('disabled', false);
            }

            if (currentCount === 1) {
                $('.lesson-row .row-delete-button').remove();
            }
        });
    }
    renderLessonRow(parseInt($('#add-lesson-input').val()));

    $('#add-lesson-button').click(function () {
        let value = parseInt($('#add-lesson-input').val());
        let max = parseInt($('#add-lesson-input').attr('max'));

        let newValue = value + 1;
        if (newValue <= max) {
            renderLessonRow(newValue);
            $('#add-lesson-input').val(newValue);
        }
        if (newValue >= max) {
            $('#add-lesson-button').attr('disabled', true);
        } else {
            $('#add-lesson-button').attr('disabled', false);
        }
    });

    $('#add-lesson-input').on('input', function () {
        let value = parseInt($(this).val());
        let min = parseInt($(this).attr('min'));
        let max = parseInt($(this).attr('max'));

        if (value < min) {
            value = min;
            $(this).val(min);
        }
        if (value > max) {
            value = max;
            $(this).val(max);
        }
        if (value >= max) {
            $('#add-lesson-button').attr('disabled', true);
        } else {
            $('#add-lesson-button').attr('disabled', false);
        }

        if (!isNaN(value)) {
            renderLessonRow(value);
        }
    });

    function findLetter(value) {
        if (value > 0 && value < 51) {
            return `<span class="fw-bolder text-danger">${value} F</span>`;
        } else if (value >= 51 && value < 61) {
            return `<span class="fw-bolder text-warning">${value} E</span>`;
        } else if (value >= 61 && value < 71) {
            return `<span class="fw-bolder text-warning">${value} D</span>`;
        } else if (value >= 71 && value < 81) {
            return `<span class="fw-bolder text-warning">${value} C</span>`;
        } else if (value >= 81 && value < 91) {
            return `<span class="fw-bolder text-primary">${value} B</span>`;
        } else if (value >= 91) {
            return `<span class="fw-bolder text-success">${value} A</span>`;
        }
    };

    function calculateResult() {
        let totalWeighted = 0;
        let totalCredits = 0;

        let umumiBallar = [];
        let hasEmpty = false;

        $('.lesson-row').each(function () {
            let kreditInput = $(this).find('.kredit-input');
            let balInput = $(this).find('.bal-input');
            let kredit = kreditInput.val();
            let bal = balInput.val();

            kreditInput.removeClass('is-invalid');
            balInput.removeClass('is-invalid');

            if (kredit === '' || bal === '') {
                if (kredit === '') {
                    kreditInput.addClass('is-invalid');
                }
                if (bal === '') {
                    balInput.addClass('is-invalid');
                }
                hasEmpty = true;
                return;
            }else{
                hasEmpty = false;
            }

            kredit = parseInt(kredit);
            bal = parseFloat(bal);
            totalWeighted += kredit * bal;
            totalCredits += kredit;
            umumiBallar.push(bal);
        });
        if (hasEmpty) {

            $('#warning-message').removeClass('d-none');
            return;
        } else {
            $('#warning-message').addClass('d-none');
            let result = totalCredits > 0 ? (totalWeighted / totalCredits).toFixed(2) : 0;
            $('#result .bal').text(`Ortalama bal: ${result}`);

            // teqaudun tapilmasi
            let teqaud = '';
            let over51 = umumiBallar.filter(value => value < 51).length;

            if (umumiBallar.length > 0) {
                if (umumiBallar.every(v => v >= 91)) {
                    teqaud = 'Təqaüd növü: əlaçı';
                } else if (umumiBallar.every(v => v >= 71) && umumiBallar.some(v => v >= 91)) {
                    teqaud = 'Təqaüd növü: zərbəçi';
                } else if (umumiBallar.every(v => v >= 51)) {
                    teqaud = 'Təqaüd növü: adi';
                } else if (over51 > 0) {
                    teqaud = `Təqaüd növü: Yoxdur. Kəsr sayı: ${over51}`;
                }
            }
            $('#result .teqaud').text(teqaud);
            // qiymetlendirme
            let qiymetler = umumiBallar.map(bal => { return findLetter(bal) });
            $('#qiymetler').html(`Qiymətlər: ${qiymetler.join(', ')}`);
        }

    };

    $('#calculate-button').on('click', calculateResult);
})