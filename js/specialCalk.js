function lgotniyCalc(programm, summ, avans) {
	var margArray = [];
	var percent = 0;
	var cycle = 0;
	console.log(programm);
	if (programm.includes("Льготный")) {
		switch (programm) {
			case 'Льготный 3 мес':
				cycle = /\d+/.exec(programm);
				cycle = Number(cycle[0]);
				percent = 0.04;
				margArray[0] = 0.0456;
				margArray[1] = 0.0076;
				margArray[2] = 0.0076;
				margArray[3] = 0.0554;
				margArray[4] = 0.0256;
				margArray[5] = 0.0235;
				margArray[6] = 0.0226;
				margArray[7] = 0.0204;
				margArray[8] = 0.0215;
				margArray[9] = 0.0195;
				margArray[10] = 0.0183;
				margArray[11] = 0.0167;
				break;
			case 'Льготный 5 мес':
				cycle = /\d+/.exec(programm);
				cycle = Number(cycle[0]);
				percent = 0.07;
				margArray[0] = 0.0476;
				margArray[1] = 0.0160;
				margArray[2] = 0.0160;
				margArray[3] = 0.0160;
				margArray[4] = 0.0160;
				margArray[5] = 0.0539;
				margArray[6] = 0.0226;
				margArray[7] = 0.0204;
				margArray[8] = 0.0215;
				margArray[9] = 0.0195;
				margArray[10] = 0.0183;
				margArray[11] = 0.0167;
				break;
			case 'Льготный Супер 5':
				cycle = /\d+/.exec(programm);
				cycle = Number(cycle[0]);
				percent = 0.1;
				margArray[0] = 0.0342;
				margArray[1] = 0.0315;
				margArray[2] = 0.0196;
				margArray[3] = 0.0145;
				margArray[4] = 0.0114;
				margArray[5] = 0.0416;
				margArray[6] = 0.0357;
				margArray[7] = 0.0317;
				margArray[8] = 0.026;
				margArray[9] = 0.0186;
				margArray[10] = 0.0132;
				margArray[11] = 0.0064;
				break;
			case 'Льготный Супер 6':
				cycle = /\d+/.exec(programm);
				cycle = Number(cycle[0]);
				percent = 0.1;
				margArray[0] = 0.0382;
				margArray[1] = 0.0338;
				margArray[2] = 0.025;
				margArray[3] = 0.0198;
				margArray[4] = 0.0141;
				margArray[5] = 0.0121;
				margArray[6] = 0.0395;
				margArray[7] = 0.0349;
				margArray[8] = 0.0291;
				margArray[9] = 0.0188;
				margArray[10] = 0.0132;
				margArray[11] = 0.0061;
				break;
			case 'Льготный Супер 7':
				cycle = /\d+/.exec(programm);
				cycle = Number(cycle[0]);
				percent = 0.1;
				margArray[0] = 0.0425;
				margArray[1] = 0.0397;
				margArray[2] = 0.0266;
				margArray[3] = 0.0201;
				margArray[4] = 0.0173;
				margArray[5] = 0.0119;
				margArray[6] = 0.0087;
				margArray[7] = 0.0393;
				margArray[8] = 0.0324;
				margArray[9] = 0.0226;
				margArray[10] = 0.0162;
				margArray[11] = 0.0074;
				break;
			case 'Льготный Супер 8':
				cycle = /\d+/.exec(programm);
				cycle = Number(cycle[0]);
				percent = 0.1;
				margArray[0] = 0.0399;
				margArray[1] = 0.0357;
				margArray[2] = 0.0264;
				margArray[3] = 0.0245;
				margArray[4] = 0.0174;
				margArray[5] = 0.0155;
				margArray[6] = 0.0089;
				margArray[7] = 0.0071;
				margArray[8] = 0.0433;
				margArray[9] = 0.0323;
				margArray[10] = 0.023;
				margArray[11] = 0.0108;
				break;
			case 'Льготный Платинум 6':
				cycle = /\d+/.exec(programm);
				cycle = Number(cycle[0]);
				percent = 0.1; //скидка партнера
				if (avans == 0) {
					margArray[0] = 0.0255;
					margArray[1] = 0.023;
					margArray[2] = 0.0185;
					margArray[3] = 0.0179;
					margArray[4] = 0.0147;
					margArray[5] = 0.0116;
					margArray[6] = 0.1028;
					margArray[7] = 0.0874;
					margArray[8] = 0.0691;
					margArray[9] = 0.0448;
					margArray[10] = 0.0332;
					margArray[11] = 0.0157;
				}
				if (avans == 10) {
					margArray[0] = 0.0382;
					margArray[1] = 0.0233;
					margArray[2] = 0.0188;
					margArray[3] = 0.0182;
					margArray[4] = 0.0146;
					margArray[5] = 0.0120;
					margArray[6] = 0.1066;
					margArray[7] = 0.0898;
					margArray[8] = 0.0587;
					margArray[9] = 0.0394;
					margArray[10] = 0.0339;
					margArray[11] = 0.0107;
				}
				if (avans == 20) {
					margArray[0] = 0.0535;
					margArray[1] = 0.0237;
					margArray[2] = 0.0192;
					margArray[3] = 0.0186;
					margArray[4] = 0.0155;
					margArray[5] = 0.0124;
					margArray[6] = 0.0928;
					margArray[7] = 0.0875;
					margArray[8] = 0.0590;
					margArray[9] = 0.0397;
					margArray[10] = 0.0343;
					margArray[11] = 0.0080;
				}


				break;
			case 'Льготный Платинум 10':
				cycle = /\d+/.exec(programm);
				cycle = Number(cycle[0]);
				percent = 0.1418;//скидка партнера
				if (summa_zaim > 29999) {
					if (avans == 0) {
						margArray[0] = 0.0255;
						margArray[1] = 0.0239;
						margArray[2] = 0.0201;
						margArray[3] = 0.0205;
						margArray[4] = 0.0181;
						margArray[5] = 0.0158;
						margArray[6] = 0.0131;
						margArray[7] = 0.0114;
						margArray[8] = 0.0096;
						margArray[9] = 0.0073;
						margArray[10] = 0.082;
						margArray[11] = 0.0774;
						margArray[12] = 0.0766;
						margArray[13] = 0.0729;
						margArray[14] = 0.0515;
						margArray[15] = 0.0368;
						margArray[16] = 0.0253;
						margArray[17] = 0.0128;
					}
					if (avans == 10) {
						margArray[0] = 0.0382;
						margArray[1] = 0.0282;
						margArray[2] = 0.0204;
						margArray[3] = 0.0209;
						margArray[4] = 0.0185;
						margArray[5] = 0.0174;
						margArray[6] = 0.014;
						margArray[7] = 0.0123;
						margArray[8] = 0.0101;
						margArray[9] = 0.0069;
						margArray[10] = 0.0835;
						margArray[11] = 0.0769;
						margArray[12] = 0.0762;
						margArray[13] = 0.0727;
						margArray[14] = 0.0482;
						margArray[15] = 0.0308;
						margArray[16] = 0.0184;
						margArray[17] = 0.007;
					}
					if (avans == 20) {
						margArray[0] = 0.051;
						margArray[1] = 0.0392;
						margArray[2] = 0.021;
						margArray[3] = 0.0215;
						margArray[4] = 0.0192;
						margArray[5] = 0.018;
						margArray[6] = 0.0146;
						margArray[7] = 0.0129;
						margArray[8] = 0.0103;
						margArray[9] = 0.0077;
						margArray[10] = 0.0804;
						margArray[11] = 0.0731;
						margArray[12] = 0.0718;
						margArray[13] = 0.0677;
						margArray[14] = 0.0505;
						margArray[15] = 0.0229;
						margArray[16] = 0.0131;
						margArray[17] = 0.0057;
					}
				} else {
					if (avans == 0) {
						margArray[0] = 0.0255;
						margArray[1] = 0.0239;
						margArray[2] = 0.0201;
						margArray[3] = 0.0206;
						margArray[4] = 0.0183;
						margArray[5] = 0.016;
						margArray[6] = 0.0129;
						margArray[7] = 0.0112;
						margArray[8] = 0.0096;
						margArray[9] = 0.0074;
						margArray[10] = 0.0848;
						margArray[11] = 0.079;
						margArray[12] = 0.0702;
						margArray[13] = 0.0553;
						margArray[14] = 0.0413;
						margArray[15] = 0.0361;
						margArray[16] = 0.0248;
						margArray[17] = 0.0122;
					}
					if (avans == 10) {
						margArray[0] = 0.0382;
						margArray[1] = 0.0283;
						margArray[2] = 0.0205;
						margArray[3] = 0.021;
						margArray[4] = 0.0187;
						margArray[5] = 0.0176;
						margArray[6] = 0.0133;
						margArray[7] = 0.0116;
						margArray[8] = 0.01;
						margArray[9] = 0.0078;
						margArray[10] = 0.0857;
						margArray[11] = 0.0774;
						margArray[12] = 0.0723;
						margArray[13] = 0.054;
						margArray[14] = 0.0393;
						margArray[15] = 0.03;
						margArray[16] = 0.0182;
						margArray[17] = 0.0053;
					}
					if (avans == 20) {
						margArray[0] = 0.051;
						margArray[1] = 0.0393;
						margArray[2] = 0.0211;
						margArray[3] = 0.0217;
						margArray[4] = 0.0193;
						margArray[5] = 0.0183;
						margArray[6] = 0.0138;
						margArray[7] = 0.0122;
						margArray[8] = 0.0106;
						margArray[9] = 0.0083;
						margArray[10] = 0.0847;
						margArray[11] = 0.0757;
						margArray[12] = 0.070;
						margArray[13] = 0.0502;
						margArray[14] = 0.0338;
						margArray[15] = 0.0227;
						margArray[16] = 0.013;
						margArray[17] = 0.0035;
					}
				}
				break;
			case "Льготный с 4 равными платежами":
				percent = 0.04;//скидка партнера
				cycle = 3;
				margArray[0] = 0.0476;
				margArray[1] = 0.0063;
				margArray[2] = 0.0025;
				margArray[3] = 0.1176;
				margArray[4] = 0.1076;
				margArray[5] = 0.0768;
				margArray[6] = 0.0363;
				margArray[7] = 0.0278;
				margArray[8] = 0.023;
				margArray[9] = 0.0061;
				margArray[10] = 0.003;
				margArray[11] = 0.001;
				break;


			case "Льготный с 6 равными платежами":
				percent = 0.07;
				cycle = 5;
				margArray[0] = 0.0651;
				margArray[1] = 0.0135;
				margArray[2] = 0.0051;
				margArray[3] = 0.0048;
				margArray[4] = 0.0033;
				margArray[5] = 0.1245;
				margArray[6] = 0.1123;
				margArray[7] = 0.109;
				margArray[8] = 0.0712;
				margArray[9] = 0.0067;
				margArray[10] = 0.004;
				margArray[11] = 0.0018;
				break;
			default :
				percent = 0.04;
				cycle = /\d+/.exec(programm);
				cycle = Number(cycle[0]);
				margArray[0] = 0.0213;
				margArray[1] = 0.0107;
				margArray[2] = 0.0092;
				margArray[3] = 0.0076;
				margArray[4] = 0.0060;
				margArray[5] = 0.0060;
				margArray[6] = 0.01070;
				margArray[7] = 0.0408;
				margArray[8] = 0.0215;
				margArray[9] = 0.0195;
				margArray[10] = 0.0183;
				margArray[11] = 0.0167;
				break;
		}
		let total_sum = summ - avans - (summ*percent);
		//let summa_zaima = 0;
		let total_overpayment = 0;
		for(i=0;i<margArray.length;i++){
			total_overpayment += Math.round(total_sum * margArray[i]);
		}
		let monthly_payment = $('#monthly_installment').val();
		//let monthly_payment = Math.ceil((total_sum + total_overpayment ) / 12);
		if (programm.includes('Льготный с 4 равными платежами') ||
			programm.includes('Льготный с 6 равными платежами') )
		{
			console.log(total_sum, cycle);
			monthly_payment = Math.round((summ - avans) / cycle); //($summ - $avans_to_partner)/$cycle;
		}
		let date = new Date;
		let final_date = new Date(date.setMonth(date.getMonth()+cycle));
		let result = {
			total: summ - avans,
			monthly: monthly_payment,
			months: cycle,
			final: (summ - avans) - (monthly_payment * (cycle-1)),
			date: final_date.toLocaleDateString(),
		}
		console.log((total_sum + total_overpayment ) / 12);
		$('.logt-date span').text(result.date);
		$('.monthly-payment span').text(result.monthly + ' руб.');
		$('.final-payment span').text(result.final + ' руб.');
		$('.total-payment span').text(result.total + ' руб.');
		$('.logt-block').show();
		//return result;
	} else {
		$('.logt-block').hide();
		//return false;
	}
	let months = $('select[name=months]').val();
	fillTempForm(programm,months,summ,avans);
}
function fillTempForm(programm,months,summ,avans_to_partner) {
	//let months = $('select[name=months]').val();
	/*let programm = $('select[name=programm] option:selected').text()
	let summ = parseFloat($('input[name=summ]').val()); // сумма товара
	summ = summ ? summ : 0; //если сумма не указано, то 0
	var avans = parseFloat($('select[name=avans]').val()); //аванс
	let avans_to_partner = avans && avans != 0 ? parseFloat(((summ * avans) / 100).toFixed(2)) : 0;*/
	let login = $('input[name=login]').val();
	let overpayment = $('input[name=overpayment]').val();
	let summa_dogovor = $('input[name=summa_dogovor]').val();
	let summa_zaim = $('input[name=summa_zaim]').val();
	let monthly_payment = $('#monthly_installment').val();
	$('#temp_form').empty();
	$('#temp_form').append(createHiddenInput('programm',programm));
	$('#temp_form').append(createHiddenInput('months',months));
	$('#temp_form').append(createHiddenInput('summ',summ));
	$('#temp_form').append(createHiddenInput('avans_to_partner',avans_to_partner));
	$('#temp_form').append(createHiddenInput('monthly_installment',monthly_payment));
	$('#temp_form').append(createHiddenInput('login',login));
	$('#temp_form').append(createHiddenInput('overpayment',overpayment));
	$('#temp_form').append(createHiddenInput('summa_dogovor',summa_dogovor));
	$('#temp_form').append(createHiddenInput('summa_zaim',summa_zaim));
	$('#temp_form').attr('action', '/main/printPdfLgot');
	//$('#temp_form').submit();
}

function createHiddenInput(name, val) {
	return '<input type="hidden" name="'+name+'" value="'+val+'">';
}
